import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  OnModuleDestroy,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { randomUUID } from 'crypto';
import {
  buildMonthlyReportEmail,
  type MailLang,
} from './monthly-report.builder';
import {
  createMonthlyReportDataset,
  getMonthlyReportMonthKey,
} from './monthly-report.data';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'intense';

type TutorialState = {
  dashboard: boolean;
  meals: boolean;
  water: boolean;
  workout: boolean;
  sleep: boolean;
  tasks: boolean;
};

const DEFAULT_TUTORIAL_STATE: TutorialState = {
  dashboard: false,
  meals: false,
  water: false,
  workout: false,
  sleep: false,
  tasks: false,
};

const DEFAULT_PREFERENCES = {
  language: 'en' as MailLang,
  activityLevel: 'moderate' as ActivityLevel,
  sodiumGoal: 2300,
  sugarGoal: 50,
  sleepGoal: 8,
  tasksGoal: 0,
  emailAlertsEnabled: true,
  emailReportsEnabled: false,
  isEmailVerified: false,
};

const EMAIL_COPY: Record<
  MailLang,
  {
    verifySubject: string;
    verifyTitle: string;
    verifyIntro: string;
    verifyButton: string;
    verifyFallback: string;
    reportSubject: string;
    helpConfirmationSubject: string;
    helpConfirmationTitle: string;
    helpConfirmationMessage: string;
    helpConfirmationSubjectLabel: string;
    helpConfirmationMessageLabel: string;
  }
> = {
  en: {
    verifySubject: 'PinicoFit • Verify your notifications email',
    verifyTitle: 'Verify your email',
    verifyIntro:
      'Confirm this address to unlock alerts and monthly reports tailored to your progress.',
    verifyButton: 'Verify email',
    verifyFallback: 'If the button does not work, use this link:',
    reportSubject: 'PinicoFit • Your monthly rewind is here',
    helpConfirmationSubject: 'PinicoFit • Help request received',
    helpConfirmationTitle: 'We got your message',
    helpConfirmationMessage:
      ', your help/report request was sent successfully. We will review it as soon as possible.',
    helpConfirmationSubjectLabel: 'Subject',
    helpConfirmationMessageLabel: 'Your Message',
  },
  br: {
    verifySubject: 'PinicoFit • Verifique seu e-mail de notificações',
    verifyTitle: 'Verifique seu e-mail',
    verifyIntro:
      'Confirme este endereço para liberar alertas e relatórios mensais alinhados ao seu progresso.',
    verifyButton: 'Verificar e-mail',
    verifyFallback: 'Se o botão não funcionar, use este link:',
    reportSubject: 'PinicoFit • Seu resumo mensal chegou',
    helpConfirmationSubject: 'PinicoFit • Solicitação de ajuda recebida',
    helpConfirmationTitle: 'Recebemos sua mensagem',
    helpConfirmationMessage:
      ', sua solicitação de ajuda/reporte foi enviada com sucesso. Ela será avaliada assim que possível.',
    helpConfirmationSubjectLabel: 'Assunto',
    helpConfirmationMessageLabel: 'Sua Mensagem',
  },
  es: {
    verifySubject: 'PinicoFit • Verifica tu correo de notificaciones',
    verifyTitle: 'Verifica tu correo',
    verifyIntro:
      'Confirma esta dirección para desbloquear alertas e informes mensuales adaptados a tu progreso.',
    verifyButton: 'Verificar correo',
    verifyFallback: 'Si el botón no funciona, usa este enlace:',
    reportSubject: 'PinicoFit • Tu resumen mensual ya está aquí',
    helpConfirmationSubject: 'PinicoFit • Solicitud de ayuda recibida',
    helpConfirmationTitle: 'Recibimos tu mensaje',
    helpConfirmationMessage:
      ', tu solicitud de ayuda/reporte fue enviada con exito. La revisaremos lo antes posible.',
    helpConfirmationSubjectLabel: 'Asunto',
    helpConfirmationMessageLabel: 'Tu Mensaje',
  },
};

type UserWithPreferences = User & { userPreferences?: any | null };

@Injectable()
export class UsersService implements OnModuleDestroy {
  private readonly logger = new Logger(UsersService.name);
  private monthlyReportTimer: NodeJS.Timeout | null = null;
  private isProcessingMonthlyReports = false;

  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
  ) {
    this.startMonthlyReportScheduler();
  }

  onModuleDestroy() {
    if (this.monthlyReportTimer) {
      clearInterval(this.monthlyReportTimer);
      this.monthlyReportTimer = null;
    }
  }

  private startMonthlyReportScheduler() {
    if (this.monthlyReportTimer) return;

    this.monthlyReportTimer = setInterval(
      () => {
        void this.processMonthlyReportDispatches().catch((error) => {
          this.logger.error('Monthly report scheduler failed.', error);
        });
      },
      1000 * 60 * 15,
    );

    setTimeout(() => {
      void this.processMonthlyReportDispatches().catch((error) => {
        this.logger.error('Startup monthly report job failed.', error);
      });
    }, 5000);
  }

  private shouldRunMonthlyReportJob(reference = new Date()) {
    return reference.getDate() === 1 && reference.getHours() >= 9;
  }

  private getActivityMultiplier(level: ActivityLevel): number {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      intense: 1.9,
    };
    return multipliers[level] || 1.2;
  }

  private normalizeTutorialState(input?: Record<string, boolean> | null) {
    return {
      ...DEFAULT_TUTORIAL_STATE,
      ...(input || {}),
    };
  }

  private calculateGoals(data: {
    age?: number | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    goal?: string | null;
    activityLevel?: string | null;
  }) {
    const age = data.age || 25;
    const weight = data.weight || 70;
    const height = data.height || 170;
    const gender = data.gender || 'other';
    const goal = data.goal || 'maintain';
    const activityLevel = (data.activityLevel ||
      DEFAULT_PREFERENCES.activityLevel) as ActivityLevel;

    const bmrBase = 10 * weight + 6.25 * height - 5 * age;
    const bmr =
      gender === 'male'
        ? bmrBase + 5
        : gender === 'female'
          ? bmrBase - 161
          : bmrBase - 78;

    const maintenanceCalories = bmr * this.getActivityMultiplier(activityLevel);
    const calorieOffset = goal === 'bulk' ? 250 : goal === 'cut' ? -400 : 0;
    const calorieGoal = Math.max(
      Math.round(maintenanceCalories + calorieOffset),
      1200,
    );

    const proteinPerKg = goal === 'cut' ? 2.2 : goal === 'bulk' ? 1.9 : 2.0;
    const fatPerKg = goal === 'cut' ? 0.8 : 0.9;
    const proteinGoal = Math.round(weight * proteinPerKg);
    const fatGoal = Math.round(weight * fatPerKg);
    const remainingCalories = Math.max(
      calorieGoal - proteinGoal * 4 - fatGoal * 9,
      0,
    );
    const carbsGoal = Math.round(remainingCalories / 4);

    const activityWaterBonus = {
      sedentary: 0,
      light: 250,
      moderate: 500,
      active: 750,
      intense: 1000,
    }[activityLevel];

    const waterGoal = Math.max(
      Math.round(weight * 35 + activityWaterBonus),
      1800,
    );

    return {
      waterGoal,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal,
      sodiumGoal: DEFAULT_PREFERENCES.sodiumGoal,
      sugarGoal: DEFAULT_PREFERENCES.sugarGoal,
      sleepGoal: DEFAULT_PREFERENCES.sleepGoal,
      tasksGoal: DEFAULT_PREFERENCES.tasksGoal,
      activityLevel,
    };
  }

  private serializeUser(user: UserWithPreferences) {
    const preferences = user.userPreferences || {
      ...DEFAULT_PREFERENCES,
      tutorialState: DEFAULT_TUTORIAL_STATE,
    };

    const hasCustomGoals =
      preferences.calorieGoal &&
      preferences.proteinGoal &&
      preferences.carbsGoal &&
      preferences.fatGoal;

    const calculatedFallback = hasCustomGoals
      ? null
      : this.calculateGoals({
          age: user.age,
          weight: user.weight,
          height: user.height,
          gender: user.gender,
          goal: user.goal,
          activityLevel: preferences.activityLevel,
        });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      goal: user.goal,
      isProfileComplete: user.isProfileComplete,

      preferences: {
        language: preferences.language,
        activityLevel: preferences.activityLevel,

        nutritionEnabled: preferences.nutritionEnabled ?? true,
        calorieGoal:
          preferences.calorieGoal ?? calculatedFallback?.calorieGoal ?? null,
        calorieTolerance: preferences.calorieTolerance ?? 95,
        calorieEnabled: preferences.calorieEnabled ?? true,

        proteinGoal:
          preferences.proteinGoal ?? calculatedFallback?.proteinGoal ?? null,
        proteinEnabled: preferences.proteinEnabled ?? true,

        carbsGoal:
          preferences.carbsGoal ?? calculatedFallback?.carbsGoal ?? null,
        carbsEnabled: preferences.carbsEnabled ?? true,

        fatGoal: preferences.fatGoal ?? calculatedFallback?.fatGoal ?? null,
        fatEnabled: preferences.fatEnabled ?? true,

        sodiumGoal: preferences.sodiumGoal,
        sugarGoal: preferences.sugarGoal,

        waterGoal: preferences.waterGoal ?? 2000,
        waterTolerance: preferences.waterTolerance ?? 80,
        waterEnabled: preferences.waterEnabled ?? true,

        sleepGoal: preferences.sleepGoal ?? 8,
        sleepTolerance: preferences.sleepTolerance ?? 85,
        sleepEnabled: preferences.sleepEnabled ?? true,

        workoutTolerance: preferences.workoutTolerance ?? 80,
        workoutEnabled: preferences.workoutEnabled ?? true,
        tasksGoal: preferences.tasksGoal ?? 0,
        tasksEnabled: preferences.tasksEnabled ?? true,

        tutorialState: this.normalizeTutorialState(preferences.tutorialState),
        notificationsEmail: preferences.notificationsEmail ?? user.email,
        avatar: preferences.avatar,
        isEmailVerified: preferences.isEmailVerified,
        emailAlertsEnabled: preferences.emailAlertsEnabled,
        emailReportsEnabled: preferences.emailReportsEnabled,
      },
    };
  }

  async create(data: CreateUserDto, lang?: string) {
    const userExists = await this.findByEmail(data.email);

    if (userExists) {
      throw new ConflictException('server.errors.users.email_exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const detectedLang: MailLang = lang?.startsWith('pt')
      ? 'br'
      : lang?.startsWith('es')
        ? 'es'
        : 'en';

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        isProfileComplete: false,
        userPreferences: {
          create: {
            language: detectedLang,
            tutorialState: DEFAULT_TUTORIAL_STATE as any,
          },
        },
      },
      include: { userPreferences: true },
    });
  }

  async update(id: string, requesterId: string, data: UpdateUserDto) {
    if (id !== requesterId) {
      throw new ForbiddenException('You cannot edit another user.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userPreferences: true },
    });

    if (!user) throw new NotFoundException('User not found.');

    const shouldRecalculate =
      data.recalculateGoals !== false &&
      [
        data.age,
        data.weight,
        data.height,
        data.gender,
        data.goal,
        data.activityLevel,
      ].some((v) => v !== undefined);

    const calc = shouldRecalculate
      ? this.calculateGoals({
          age: data.age ?? user.age,
          weight: data.weight ?? user.weight,
          height: data.height ?? user.height,
          gender: data.gender ?? user.gender,
          goal: data.goal ?? user.goal,
          activityLevel:
            data.activityLevel ?? user.userPreferences?.activityLevel,
        })
      : null;

    const requestedEmail = data.notificationsEmail?.trim();
    const currentEmail = user.userPreferences?.notificationsEmail ?? user.email;
    const emailChanged =
      requestedEmail !== undefined && requestedEmail !== currentEmail;

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          weight: data.weight,
          height: data.height,
          age: data.age,
          goal: data.goal,
          gender: data.gender,
          isProfileComplete: data.isProfileComplete,
        },
      }),
      this.prisma.userPreferences.upsert({
        where: { userId: id },
        update: {
          language: data.language,
          waterGoal: data.waterGoal ?? calc?.waterGoal ?? undefined,
          activityLevel: (data.activityLevel as any) ?? calc?.activityLevel,
          calorieGoal: data.calorieGoal ?? calc?.calorieGoal,
          proteinGoal: data.proteinGoal ?? calc?.proteinGoal,
          carbsGoal: data.carbsGoal ?? calc?.carbsGoal,
          fatGoal: data.fatGoal ?? calc?.fatGoal,
          sodiumGoal: data.sodiumGoal ?? calc?.sodiumGoal,
          sugarGoal: data.sugarGoal ?? calc?.sugarGoal,
          sleepGoal: data.sleepGoal,
          tasksGoal: data.tasksGoal ?? calc?.tasksGoal,
          tutorialState: data.tutorialState
            ? (this.normalizeTutorialState(data.tutorialState) as any)
            : undefined,
          notificationsEmail: emailChanged ? requestedEmail : undefined,
          isEmailVerified: emailChanged ? false : data.isEmailVerified,
          emailAlertsEnabled: data.emailAlertsEnabled,
          emailReportsEnabled: data.emailReportsEnabled,
          avatar: data.avatar,
        },
        create: {
          userId: id,
          language: data.language ?? 'en',
          waterGoal: data.waterGoal ?? calc?.waterGoal ?? 2000,
          activityLevel:
            (data.activityLevel as any) ?? calc?.activityLevel ?? 'moderate',
          calorieGoal: data.calorieGoal ?? calc?.calorieGoal,
          proteinGoal: data.proteinGoal ?? calc?.proteinGoal,
          carbsGoal: data.carbsGoal ?? calc?.carbsGoal,
          fatGoal: data.fatGoal ?? calc?.fatGoal,
          sodiumGoal: data.sodiumGoal ?? calc?.sodiumGoal ?? 2300,
          sugarGoal: data.sugarGoal ?? calc?.sugarGoal ?? 50,
          sleepGoal: data.sleepGoal ?? 8,
          tasksGoal: data.tasksGoal ?? calc?.tasksGoal ?? 8000,
          tutorialState: (data.tutorialState
            ? this.normalizeTutorialState(data.tutorialState)
            : DEFAULT_TUTORIAL_STATE) as any,
          notificationsEmail: emailChanged ? requestedEmail : user.email,
          isEmailVerified: false,
          emailAlertsEnabled: data.emailAlertsEnabled ?? true,
          emailReportsEnabled: data.emailReportsEnabled ?? false,
          avatar: data.avatar,
        },
      }),
    ]);

    return this.findById(id);
  }

  async updateGoals(userId: string, data: any) { 
    const preferences = await this.prisma.userPreferences.findUnique({ 
      where: { userId }, 
    }); 
 
    if (!preferences) { 
      throw new NotFoundException('server.errors.users.not_found'); 
    } 

    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    const now = new Date();
    const cooldownUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    type GoalKey = 'nutrition' | 'water' | 'sleep' | 'workout' | 'tasks';

    type ToggleMetaUpdate = Partial<{ 
      nutritionDeactivatedAt: Date; 
      nutritionCooldownUntil: Date; 
      waterDeactivatedAt: Date; 
      waterCooldownUntil: Date; 
      sleepDeactivatedAt: Date; 
      sleepCooldownUntil: Date; 
      workoutDeactivatedAt: Date; 
      workoutCooldownUntil: Date; 
      tasksDeactivatedAt: Date; 
      tasksCooldownUntil: Date; 
    }>; 
 
    const toggles: Array<{ 
      key: GoalKey; 
      provided: boolean;
      fromEnabled: boolean; 
      toEnabled: boolean; 
      deactivatedAtField: keyof ToggleMetaUpdate; 
      cooldownUntilField: keyof ToggleMetaUpdate; 
      lockedUntilValue: Date | null | undefined; 
    }> = [ 
      { 
        key: 'nutrition', 
        provided: typeof data.nutritionEnabled === 'boolean',
        fromEnabled: Boolean(preferences.nutritionEnabled), 
        toEnabled:
          typeof data.nutritionEnabled === 'boolean'
            ? data.nutritionEnabled
            : Boolean(preferences.nutritionEnabled),
        deactivatedAtField: 'nutritionDeactivatedAt', 
        cooldownUntilField: 'nutritionCooldownUntil', 
        lockedUntilValue: preferences.nutritionCooldownUntil, 
      }, 
      { 
        key: 'water', 
        provided: typeof data.waterEnabled === 'boolean',
        fromEnabled: Boolean(preferences.waterEnabled), 
        toEnabled:
          typeof data.waterEnabled === 'boolean'
            ? data.waterEnabled
            : Boolean(preferences.waterEnabled),
        deactivatedAtField: 'waterDeactivatedAt', 
        cooldownUntilField: 'waterCooldownUntil', 
        lockedUntilValue: preferences.waterCooldownUntil, 
      }, 
      { 
        key: 'sleep', 
        provided: typeof data.sleepEnabled === 'boolean',
        fromEnabled: Boolean(preferences.sleepEnabled), 
        toEnabled:
          typeof data.sleepEnabled === 'boolean'
            ? data.sleepEnabled
            : Boolean(preferences.sleepEnabled),
        deactivatedAtField: 'sleepDeactivatedAt', 
        cooldownUntilField: 'sleepCooldownUntil', 
        lockedUntilValue: preferences.sleepCooldownUntil, 
      }, 
      { 
        key: 'workout', 
        provided: typeof data.workoutEnabled === 'boolean',
        fromEnabled: Boolean(preferences.workoutEnabled), 
        toEnabled:
          typeof data.workoutEnabled === 'boolean'
            ? data.workoutEnabled
            : Boolean(preferences.workoutEnabled),
        deactivatedAtField: 'workoutDeactivatedAt', 
        cooldownUntilField: 'workoutCooldownUntil', 
        lockedUntilValue: preferences.workoutCooldownUntil, 
      }, 
      { 
        key: 'tasks', 
        provided: typeof data.tasksEnabled === 'boolean',
        fromEnabled: Boolean(preferences.tasksEnabled), 
        toEnabled:
          typeof data.tasksEnabled === 'boolean'
            ? data.tasksEnabled
            : Boolean(preferences.tasksEnabled),
        deactivatedAtField: 'tasksDeactivatedAt', 
        cooldownUntilField: 'tasksCooldownUntil', 
        lockedUntilValue: preferences.tasksCooldownUntil, 
      }, 
    ]; 
 
    const goalsDeactivated = toggles.filter( 
      (toggle) => toggle.provided && toggle.fromEnabled && !toggle.toEnabled, 
    ); 
 
    const goalsReactivated = toggles.filter( 
      (toggle) => toggle.provided && !toggle.fromEnabled && toggle.toEnabled, 
    ); 

    for (const toggle of goalsReactivated) {
      if (
        toggle.lockedUntilValue &&
        now.getTime() < toggle.lockedUntilValue.getTime()
      ) {
        throw new ForbiddenException('server.errors.users.goal_in_cooldown');
      }
    }

    const streakCount = Number(streak?.streakCount || 0);
    const livesRemaining = Number(streak?.livesRemaining || 0);

    const shouldCharge = streakCount > 0 && goalsReactivated.length > 0;
    const livesCost = shouldCharge ? goalsReactivated.length * 2 : 0;

    if (shouldCharge && livesRemaining < livesCost) {
      throw new BadRequestException(
        'server.errors.users.insufficient_lives_to_reactivate_goal',
      );
    }

    const toggleMetaUpdate: ToggleMetaUpdate = goalsDeactivated.reduce(
      (acc, toggle) => {
        acc[toggle.deactivatedAtField] = now;
        acc[toggle.cooldownUntilField] = cooldownUntil;
        return acc;
      },
      {} as ToggleMetaUpdate,
    );

    return this.prisma.$transaction(async (tx) => {
      if (livesCost > 0) {
        await tx.userStreak.update({
          where: { userId },
          data: {
            livesRemaining: livesRemaining - livesCost,
          },
        });
      }

      return tx.userPreferences.update({
        where: { userId },
        data: {
          nutritionEnabled: data.nutritionEnabled,
          calorieGoal: data.calorieGoal,
          calorieTolerance: data.calorieTolerance,
          calorieEnabled: data.calorieEnabled,
          proteinGoal: data.proteinGoal,
          proteinEnabled: data.proteinEnabled,
          carbsGoal: data.carbsGoal,
          carbsEnabled: data.carbsEnabled,
          fatGoal: data.fatGoal,
          fatEnabled: data.fatEnabled,

          waterGoal: data.waterGoal,
          waterTolerance: data.waterTolerance,
          waterEnabled: data.waterEnabled,

          sleepGoal: data.sleepGoal,
          sleepTolerance: data.sleepTolerance,
          sleepEnabled: data.sleepEnabled,

          workoutTolerance: data.workoutTolerance,
          workoutEnabled: data.workoutEnabled,
          tasksGoal: data.tasksGoal,
          tasksEnabled: data.tasksEnabled,

          ...toggleMetaUpdate,
        },
        include: {
          user: true,
        },
      });
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userPreferences: true },
    });

    if (!user) return null;

    return this.serializeUser(user);
  }

  async findByEmail(email: string): Promise<UserWithPreferences | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { userPreferences: true },
    });
  }

  private getAppUrl() {
    return process.env.APP_URL || 'https://pinicofit.netlify.app';
  }

  private getMailCopy(lang?: MailLang) {
    return EMAIL_COPY[lang || 'en'] || EMAIL_COPY.en;
  }

  private buildVerificationEmail(
    name: string,
    verifyUrl: string,
    lang: MailLang = 'en',
  ) {
    const copy = this.getMailCopy(lang);
    return `
      <div style="font-family:Arial,sans-serif;background:#0a0a0a;padding:32px;color:#f5f5f5">
        <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,#171717,#0f0f0f);border:1px solid rgba(255,255,255,.08);border-radius:28px;overflow:hidden">
          <div style="padding:32px;background:linear-gradient(135deg,#aa3bff22,#ff6ad522)">
            <div style="font-size:12px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#c084fc">PinicoFit</div>
            <h1 style="margin:12px 0 0;font-size:32px;line-height:1.1">${copy.verifyTitle}</h1>
            <p style="margin:12px 0 0;color:#d4d4d8;line-height:1.6">${name}, ${copy.verifyIntro}</p>
          </div>
          <div style="padding:32px">
            <a href="${verifyUrl}" style="display:inline-block;background:#aa3bff;color:#111;padding:16px 24px;border-radius:16px;font-weight:800;text-decoration:none;letter-spacing:.08em;text-transform:uppercase">${copy.verifyButton}</a>
            <p style="margin:24px 0 0;color:#a1a1aa;line-height:1.6">${copy.verifyFallback}</p>
            <p style="word-break:break-all;color:#c084fc">${verifyUrl}</p>
          </div>
        </div>
      </div>
    `;
  }

  private buildHelpReportEmail(
    userId: string,
    userName: string,
    userEmail: string,
    subject: string,
    message: string,
  ) {
    return `
      <div style="font-family:Arial,sans-serif;background:#f6f7ff;padding:24px;color:#111827">
        <div style="max-width:760px;margin:0 auto;background:white;border-radius:32px;overflow:hidden;border:1px solid #e5e7eb">
          <div style="padding:32px;background:linear-gradient(135deg,#111827 0%,#7c3aed 100%);color:white">
            <div style="font-size:12px;font-weight:800;letter-spacing:.24em;text-transform:uppercase">PinicoFit Help</div>
            <h1 style="margin:12px 0 0;font-size:30px;line-height:1.1">${subject}</h1>
            <p style="margin:12px 0 0;line-height:1.6">New help/report message sent from the app.</p>
          </div>
          <div style="padding:32px;display:grid;gap:16px">
            <div style="border:1px solid #e5e7eb;border-radius:24px;padding:20px">
              <div style="font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#a855f7">User</div>
              <p style="margin:10px 0 0;font-size:16px;line-height:1.6;color:#374151">${userName} (${userId})</p>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#6b7280">${userEmail}</p>
            </div>
            <div style="border:1px solid #e5e7eb;border-radius:24px;padding:20px">
              <div style="font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#a855f7">Message</div>
              <p style="margin:10px 0 0;font-size:16px;line-height:1.8;color:#374151;white-space:pre-wrap">${message}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private buildHelpConfirmationEmail(
    userName: string,
    lang: MailLang = 'en',
    subject: string,
    message: string,
  ) {
    return `
    <div style="font-family:Arial,sans-serif;padding:24px;color:#f5f5f5">
      <div style="max-width:640px;margin:0 auto;background:linear-gradient(180deg,#171717,#09090b);border:1px solid rgba(255,255,255,.08);border-radius:28px;overflow:hidden">
        
        <div style="padding:32px;background:linear-gradient(135deg,#aa3bff22,#ff6ad522)">
          <div style="font-size:12px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:#c084fc">PinicoFit Support</div>
          <h1 style="margin:12px 0 0;font-size:30px;line-height:1.1">${EMAIL_COPY[lang].helpConfirmationTitle}</h1>
          <p style="margin:12px 0 0;color:#d4d4d8;line-height:1.6"><b>${userName}</b>${EMAIL_COPY[lang].helpConfirmationMessage}</p>
        </div>

        <div style="padding:0 32px 32px">
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:20px;padding:24px;margin-top:8px">
            
            <div style="margin-bottom:20px">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#a1a1aa;letter-spacing:0.1em;margin-bottom:6px">
                ${EMAIL_COPY[lang].helpConfirmationSubjectLabel}
              </div>
              <div style="font-size:16px;color:#ffffff;font-weight:500">
                ${subject}
              </div>
            </div>

            <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:20px"></div>

            <div>
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#a1a1aa;letter-spacing:0.1em;margin-bottom:6px">
                ${EMAIL_COPY[lang].helpConfirmationMessageLabel}
              </div>
              <div style="font-size:15px;color:#d4d4d8">
                ${message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }
  private buildFallbackMonthlyReportEmail(
    userName: string,
    lang: MailLang = 'en',
    referenceDate = new Date(),
  ) {
    const displayDate = new Date(referenceDate);
    displayDate.setMonth(displayDate.getMonth() - 1);

    return buildMonthlyReportEmail(
      userName,
      {
        monthLabel: new Intl.DateTimeFormat(
          lang === 'br' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
          { month: 'long', year: 'numeric' },
        ).format(displayDate),
        scoreCards: {
          disciplineScore: 0,
          dietAdherence: 0,
          hydrationAverageLiters: 0,
          workoutEfficiency: 0,
        },
        workout: {
          totalVolumeTons: 0,
          caloriesBurned: 0,
          totalHours: 0,
          totalMinutes: 0,
          trainingDays: 0,
          restDays: 0,
          completedExercises: 0,
          loadIncreases: 0,
          failedExercises: 0,
          progressionGroupName:
            lang === 'br'
              ? 'Sem dados'
              : lang === 'es'
                ? 'Sin datos'
                : 'No data',
          progressionGroupCount: 0,
          progressionExerciseName:
            lang === 'br'
              ? 'Sem dados'
              : lang === 'es'
                ? 'Sin datos'
                : 'No data',
          progressionExerciseCount: 0,
          volumeIncreasePercent: 0,
          frictionGroupName:
            lang === 'br'
              ? 'Sem dados'
              : lang === 'es'
                ? 'Sin datos'
                : 'No data',
          frictionGroupCount: 0,
          frictionExerciseName:
            lang === 'br'
              ? 'Sem dados'
              : lang === 'es'
                ? 'Sin datos'
                : 'No data',
          completedDays: 0,
          failedDays: 0,
          focusGroupName:
            lang === 'br'
              ? 'Sem dados'
              : lang === 'es'
                ? 'Sin datos'
                : 'No data',
          focusVolumeShare: 0,
        },
        water: {
          goalLiters: 0,
          goalHitDays: 0,
          adherenceRate: 0,
          peakWindowLabel: '00h - 03h',
          eveningDropPercent: 0,
          trainingDayHydrationLift: 0,
          peakDateLabel: '--',
          peakLiters: 0,
          peakContext:
            lang === 'br'
              ? 'manteve sua rotina em movimento'
              : lang === 'es'
                ? 'mantuviste tu rutina en marcha'
                : 'kept your routine moving',
        },
        sleep: {
          averageHours: 0,
          belowSixHoursDays: 0,
          consistentNights: 0,
          volumeBoostAfterConsistentNights: 0,
          weekendVariationHours: 0,
          topSleepHours: 0,
          topSleepCount: 0,
        },
        nutrition: {
          calorieAdherenceDays: 0,
          topFoods: [],
          topFoodsShare: 0,
          hardestMacroName:
            lang === 'br' ? 'proteína' : lang === 'es' ? 'proteína' : 'protein',
          hardestMacroMissRate: 0,
          perfectMatchDateLabel: '--',
          perfectMatchAvailable: false,
          failedWorkoutMacroName:
            lang === 'br'
              ? 'carboidratos'
              : lang === 'es'
                ? 'carbohidratos'
                : 'carbohydrates',
          failedWorkoutMacroDelta: 0,
        },
        habits: {
          syncDays: 0,
          longestStreak: 0,
          ruptureWeekdayLabel:
            lang === 'br'
              ? 'quinta-feira'
              : lang === 'es'
                ? 'jueves'
                : 'Thursday',
          restDietConsistency: 0,
        },
      },
      lang,
    );
  }

  private async processMonthlyReportDispatches() {
    if (this.isProcessingMonthlyReports || !this.shouldRunMonthlyReportJob()) {
      return;
    }

    this.isProcessingMonthlyReports = true;

    try {
      const monthKey = getMonthlyReportMonthKey();

      const users = await this.prisma.user.findMany({
        where: {
          userPreferences: {
            emailReportsEnabled: true,
            isEmailVerified: true,
          },
        },
        include: {
          userPreferences: true,
        },
      });

      for (const user of users) {
        const existing = await this.prisma.monthlyReportDispatch.findUnique({
          where: {
            userId_monthKey: {
              userId: user.id,
              monthKey: monthKey,
            },
          },
        });

        if (existing) continue;

        const prefs = user.userPreferences;
        const email = prefs?.notificationsEmail?.trim() || user.email;
        const lang = (prefs?.language as MailLang) || 'en';

        if (!email) continue;

        try {
          const profile = await this.findById(user.id);
          if (!profile) continue;

          const report = await createMonthlyReportDataset({
            prisma: this.prisma,
            userId: user.id,
            profile: profile,
            lang: lang,
          });

          await this.mailService.sendMail({
            to: email,
            subject: this.getMailCopy(lang).reportSubject,
            html: buildMonthlyReportEmail(user.name, report, lang),
          });

          await this.prisma.monthlyReportDispatch.create({
            data: {
              userId: user.id,
              monthKey: monthKey,
              sentAt: new Date(),
            },
          });
        } catch (error) {
          this.logger.error(`Failed to send report to user ${user.id}`, error);
          continue;
        }
      }
    } catch (error) {
      this.logger.error(
        'Monthly report dispatch processing failed.',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      this.isProcessingMonthlyReports = false;
    }
  }

  async sendVerificationEmail(
    id: string,
    requesterId: string,
    lang: MailLang = 'en',
  ) {
    if (id !== requesterId) {
      throw new ForbiddenException(
        'You cannot send a verification email for another user.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userPreferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const email = user.userPreferences?.notificationsEmail || user.email;
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await this.prisma.emailVerificationToken.create({
      data: {
        userId: id,
        email: email,
        token: token,
        expiresAt: expiresAt,
      },
    });

    const verifyUrl = `${this.getAppUrl()}/account?verifyEmailToken=${token}`;

    await this.mailService.sendMail({
      to: email,
      subject: this.getMailCopy(lang).verifySubject,
      html: this.buildVerificationEmail(user.name, verifyUrl, lang),
    });

    return { success: true };
  }

  async verifyEmailToken(token: string) {
    const record = await this.prisma.emailVerificationToken.findFirst({
      where: {
        token: token,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new NotFoundException('Invalid or expired verification token.');
    }

    await this.prisma.$transaction([
      this.prisma.userPreferences.update({
        where: { userId: record.userId },
        data: {
          notificationsEmail: record.email,
          isEmailVerified: true,
        },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return this.findById(record.userId);
  }

  async sendTestReport(
    id: string,
    requesterId: string,
    body?: { lang?: MailLang; recipientEmail?: string; recipientName?: string },
  ) {
    if (id !== requesterId) {
      throw new ForbiddenException(
        'You cannot send a report for another user.',
      );
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { userPreferences: true },
      });

      if (!user) throw new NotFoundException('User not found.');

      const profile = await this.findById(id);
      const lang =
        body?.lang || (user.userPreferences?.language as MailLang) || 'en';
      const email =
        body?.recipientEmail ||
        user.userPreferences?.notificationsEmail ||
        user.email;

      const report = await createMonthlyReportDataset({
        prisma: this.prisma,
        userId: id,
        profile: profile || {},
        lang,
      });

      await this.mailService.sendMail({
        to: email,
        subject: this.getMailCopy(lang).reportSubject,
        html: buildMonthlyReportEmail(user.name, report, lang),
      });

      return { success: true };
    } catch (error) {
      if (body?.recipientEmail) {
        await this.mailService.sendMail({
          to: body.recipientEmail,
          subject: this.getMailCopy(body.lang || 'en').reportSubject,
          html: this.buildFallbackMonthlyReportEmail(
            body.recipientName || 'Athlete',
            body.lang || 'en',
          ),
        });
        return { success: true, fallback: true };
      }
      throw new ServiceUnavailableException(
        'Monthly report could not be generated.',
      );
    }
  }

  async sendHelpReport(
    id: string,
    requesterId: string,
    body: { subject?: string; message?: string; lang?: MailLang },
  ) {
    if (id !== requesterId) {
      throw new ForbiddenException(
        'You cannot send a help message for another user.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userPreferences: true },
    });

    if (!user) throw new NotFoundException('User not found.');

    const subject = body.subject?.trim() || 'PinicoFit support request';
    const message = body.message?.trim();

    if (!message) {
      throw new BadRequestException('A message is required.');
    }

    const supportEmail = process.env.SMTP_USER || 'pinicofit@gmail.com';
    const confirmationEmail =
      user.userPreferences?.notificationsEmail || user.email;

    const lang =
      body?.lang || (user.userPreferences?.language as MailLang) || 'en';

    await this.mailService.sendMail({
      to: supportEmail,
      subject: `PinicoFit Help • ${subject}`,
      html: this.buildHelpReportEmail(
        user.id,
        user.name,
        user.email,
        subject,
        message,
      ),
    });

    await this.mailService.sendMail({
      to: confirmationEmail,
      subject: 'PinicoFit • Help request received',
      html: this.buildHelpConfirmationEmail(user.name, lang, subject, message),
    });

    return { success: true };
  }
}
