import {
  ConflictException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'intense';

type TutorialState = {
  dashboard: boolean;
  meals: boolean;
  water: boolean;
  workout: boolean;
};

interface UserPreferencesRecord {
  userId: string;
  activityLevel: ActivityLevel | null;
  calorieGoal: number | null;
  proteinGoal: number | null;
  carbsGoal: number | null;
  fatGoal: number | null;
  sodiumGoal: number;
  sugarGoal: number;
  sleepGoal: number;
  stepsGoal: number;
  tutorialState: TutorialState;
  notificationsEmail: string | null;
  isEmailVerified: boolean;
  emailAlertsEnabled: boolean;
  emailReportsEnabled: boolean;
}

const DEFAULT_TUTORIAL_STATE: TutorialState = {
  dashboard: false,
  meals: false,
  water: false,
  workout: false,
};

const DEFAULT_PREFERENCES = {
  activityLevel: 'moderate' as ActivityLevel,
  sodiumGoal: 2300,
  sugarGoal: 50,
  sleepGoal: 8,
  stepsGoal: 8000,
  emailAlertsEnabled: true,
  emailReportsEnabled: false,
  isEmailVerified: false,
};

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserPreferences" (
        "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE,
        "activityLevel" TEXT,
        "calorieGoal" INTEGER,
        "proteinGoal" INTEGER,
        "carbsGoal" INTEGER,
        "fatGoal" INTEGER,
        "sodiumGoal" INTEGER NOT NULL DEFAULT 2300,
        "sugarGoal" INTEGER NOT NULL DEFAULT 50,
        "sleepGoal" DOUBLE PRECISION NOT NULL DEFAULT 8,
        "stepsGoal" INTEGER NOT NULL DEFAULT 8000,
        "tutorialState" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "notificationsEmail" TEXT,
        "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
        "emailAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
        "emailReportsEnabled" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private getActivityMultiplier(level: ActivityLevel) {
    return {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      intense: 1.9,
    }[level];
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
    const calorieOffset =
      goal === 'bulk' ? 250 : goal === 'cut' ? -400 : 0;
    const calorieGoal = Math.max(Math.round(maintenanceCalories + calorieOffset), 1200);

    const proteinPerKg =
      goal === 'cut' ? 2.2 : goal === 'bulk' ? 1.9 : 2.0;
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

    const waterGoal = Math.max(Math.round(weight * 35 + activityWaterBonus), 1800);
    const stepsGoal = {
      sedentary: 6000,
      light: 7500,
      moderate: 9000,
      active: 11000,
      intense: 13000,
    }[activityLevel];

    return {
      waterGoal,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal,
      sodiumGoal: DEFAULT_PREFERENCES.sodiumGoal,
      sugarGoal: DEFAULT_PREFERENCES.sugarGoal,
      sleepGoal: DEFAULT_PREFERENCES.sleepGoal,
      stepsGoal,
      activityLevel,
    };
  }

  private async getUserPreferences(userId: string): Promise<UserPreferencesRecord> {
    const [row] = await this.prisma.$queryRaw<
      Array<Record<string, unknown>>
    >`SELECT * FROM "UserPreferences" WHERE "userId" = ${userId} LIMIT 1`;

    if (!row) {
      return {
        userId,
        activityLevel: DEFAULT_PREFERENCES.activityLevel,
        calorieGoal: null,
        proteinGoal: null,
        carbsGoal: null,
        fatGoal: null,
        sodiumGoal: DEFAULT_PREFERENCES.sodiumGoal,
        sugarGoal: DEFAULT_PREFERENCES.sugarGoal,
        sleepGoal: DEFAULT_PREFERENCES.sleepGoal,
        stepsGoal: DEFAULT_PREFERENCES.stepsGoal,
        tutorialState: DEFAULT_TUTORIAL_STATE,
        notificationsEmail: null,
        isEmailVerified: DEFAULT_PREFERENCES.isEmailVerified,
        emailAlertsEnabled: DEFAULT_PREFERENCES.emailAlertsEnabled,
        emailReportsEnabled: DEFAULT_PREFERENCES.emailReportsEnabled,
      };
    }

    return {
      userId,
      activityLevel: (row.activityLevel as ActivityLevel | null) ?? DEFAULT_PREFERENCES.activityLevel,
      calorieGoal: (row.calorieGoal as number | null) ?? null,
      proteinGoal: (row.proteinGoal as number | null) ?? null,
      carbsGoal: (row.carbsGoal as number | null) ?? null,
      fatGoal: (row.fatGoal as number | null) ?? null,
      sodiumGoal: Number(row.sodiumGoal ?? DEFAULT_PREFERENCES.sodiumGoal),
      sugarGoal: Number(row.sugarGoal ?? DEFAULT_PREFERENCES.sugarGoal),
      sleepGoal: Number(row.sleepGoal ?? DEFAULT_PREFERENCES.sleepGoal),
      stepsGoal: Number(row.stepsGoal ?? DEFAULT_PREFERENCES.stepsGoal),
      tutorialState: this.normalizeTutorialState(
        (row.tutorialState as Record<string, boolean> | null) ?? null,
      ),
      notificationsEmail: (row.notificationsEmail as string | null) ?? null,
      isEmailVerified: Boolean(row.isEmailVerified),
      emailAlertsEnabled: Boolean(row.emailAlertsEnabled),
      emailReportsEnabled: Boolean(row.emailReportsEnabled),
    };
  }

  private async upsertUserPreferences(
    userId: string,
    data: Partial<UserPreferencesRecord>,
  ) {
    const current = await this.getUserPreferences(userId);
    const next = {
      ...current,
      ...data,
      tutorialState: this.normalizeTutorialState(
        data.tutorialState || current.tutorialState,
      ),
    };

    await this.prisma.$executeRaw`
      INSERT INTO "UserPreferences" (
        "userId",
        "activityLevel",
        "calorieGoal",
        "proteinGoal",
        "carbsGoal",
        "fatGoal",
        "sodiumGoal",
        "sugarGoal",
        "sleepGoal",
        "stepsGoal",
        "tutorialState",
        "notificationsEmail",
        "isEmailVerified",
        "emailAlertsEnabled",
        "emailReportsEnabled",
        "updatedAt"
      )
      VALUES (
        ${userId},
        ${next.activityLevel},
        ${next.calorieGoal},
        ${next.proteinGoal},
        ${next.carbsGoal},
        ${next.fatGoal},
        ${next.sodiumGoal},
        ${next.sugarGoal},
        ${next.sleepGoal},
        ${next.stepsGoal},
        ${JSON.stringify(next.tutorialState)}::jsonb,
        ${next.notificationsEmail},
        ${next.isEmailVerified},
        ${next.emailAlertsEnabled},
        ${next.emailReportsEnabled},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("userId") DO UPDATE SET
        "activityLevel" = EXCLUDED."activityLevel",
        "calorieGoal" = EXCLUDED."calorieGoal",
        "proteinGoal" = EXCLUDED."proteinGoal",
        "carbsGoal" = EXCLUDED."carbsGoal",
        "fatGoal" = EXCLUDED."fatGoal",
        "sodiumGoal" = EXCLUDED."sodiumGoal",
        "sugarGoal" = EXCLUDED."sugarGoal",
        "sleepGoal" = EXCLUDED."sleepGoal",
        "stepsGoal" = EXCLUDED."stepsGoal",
        "tutorialState" = EXCLUDED."tutorialState",
        "notificationsEmail" = EXCLUDED."notificationsEmail",
        "isEmailVerified" = EXCLUDED."isEmailVerified",
        "emailAlertsEnabled" = EXCLUDED."emailAlertsEnabled",
        "emailReportsEnabled" = EXCLUDED."emailReportsEnabled",
        "updatedAt" = CURRENT_TIMESTAMP
    `;
  }

  private async serializeUser(user: User) {
    const preferences = await this.getUserPreferences(user.id);
    const calculatedFallback =
      preferences.calorieGoal &&
      preferences.proteinGoal &&
      preferences.carbsGoal &&
      preferences.fatGoal
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
      waterGoal: user.waterGoal,
      isProfileComplete: user.isProfileComplete,
      activityLevel: preferences.activityLevel,
      calorieGoal: preferences.calorieGoal ?? calculatedFallback?.calorieGoal ?? null,
      proteinGoal: preferences.proteinGoal ?? calculatedFallback?.proteinGoal ?? null,
      carbsGoal: preferences.carbsGoal ?? calculatedFallback?.carbsGoal ?? null,
      fatGoal: preferences.fatGoal ?? calculatedFallback?.fatGoal ?? null,
      sodiumGoal: preferences.sodiumGoal,
      sugarGoal: preferences.sugarGoal,
      sleepGoal: preferences.sleepGoal,
      stepsGoal: preferences.stepsGoal,
      tutorialState: preferences.tutorialState,
      notificationsEmail: preferences.notificationsEmail ?? user.email,
      isEmailVerified: preferences.isEmailVerified,
      emailAlertsEnabled: preferences.emailAlertsEnabled,
      emailReportsEnabled: preferences.emailReportsEnabled,
    };
  }

  async create(data: CreateUserDto) {
    const userExists = await this.findByEmail(data.email);

    if (userExists) {
      throw new ConflictException('server.errors.users.email_exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        isProfileComplete: false,
      },
    });
  }

  async update(id: string, requesterId: string, data: UpdateUserDto) {
    if (id !== requesterId) {
      throw new ForbiddenException('VocÃª nÃ£o pode editar outro usuÃ¡rio');
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      throw new ForbiddenException('UsuÃ¡rio nÃ£o encontrado');
    }

    const userPayload = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.weight !== undefined ? { weight: data.weight } : {}),
      ...(data.height !== undefined ? { height: data.height } : {}),
      ...(data.age !== undefined ? { age: data.age } : {}),
      ...(data.goal !== undefined ? { goal: data.goal } : {}),
      ...(data.gender !== undefined ? { gender: data.gender } : {}),
      ...(data.waterGoal !== undefined ? { waterGoal: data.waterGoal } : {}),
      ...(data.isProfileComplete !== undefined
        ? { isProfileComplete: data.isProfileComplete }
        : {}),
    };

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: Object.keys(userPayload).length ? userPayload : {},
    });

    const mergedUser = {
      ...currentUser,
      ...updatedUser,
    };

    const shouldRecalculate =
      data.recalculateGoals !== false &&
      [
        data.age,
        data.weight,
        data.height,
        data.gender,
        data.goal,
        data.activityLevel,
      ].some((value) => value !== undefined);

    const calculatedGoals = shouldRecalculate
      ? this.calculateGoals({
          age: mergedUser.age,
          weight: mergedUser.weight,
          height: mergedUser.height,
          gender: mergedUser.gender,
          goal: mergedUser.goal,
          activityLevel: data.activityLevel,
        })
      : null;

    if (calculatedGoals?.waterGoal && data.waterGoal === undefined) {
      await this.prisma.user.update({
        where: { id },
        data: {
          waterGoal: calculatedGoals.waterGoal,
        },
      });
    }

    await this.upsertUserPreferences(id, {
      activityLevel:
        (data.activityLevel as ActivityLevel | undefined) ??
        (calculatedGoals?.activityLevel as ActivityLevel | undefined),
      calorieGoal: data.calorieGoal ?? calculatedGoals?.calorieGoal,
      proteinGoal: data.proteinGoal ?? calculatedGoals?.proteinGoal,
      carbsGoal: data.carbsGoal ?? calculatedGoals?.carbsGoal,
      fatGoal: data.fatGoal ?? calculatedGoals?.fatGoal,
      sodiumGoal: data.sodiumGoal ?? calculatedGoals?.sodiumGoal,
      sugarGoal: data.sugarGoal ?? calculatedGoals?.sugarGoal,
      sleepGoal: data.sleepGoal,
      stepsGoal: data.stepsGoal ?? calculatedGoals?.stepsGoal,
      tutorialState: data.tutorialState
        ? this.normalizeTutorialState(data.tutorialState)
        : undefined,
      notificationsEmail: data.notificationsEmail ?? mergedUser.email,
      isEmailVerified: data.isEmailVerified,
      emailAlertsEnabled: data.emailAlertsEnabled,
      emailReportsEnabled: data.emailReportsEnabled,
    });

    return this.findById(id);
  }

  async findById(id: string): Promise<Record<string, unknown> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return this.serializeUser(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
