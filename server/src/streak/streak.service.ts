import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { UserPreferences, FlameLevel } from '@prisma/client';
import { WorkoutExerciseLogEntry } from 'src/types';

type GoalKey = 'nutrition' | 'water' | 'sleep' | 'workout' | 'tasks';

const DEFAULT_MAX_LIVES_PER_MONTH = 5;

const toDateKey = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().slice(0, 10);
};

const dateKeyToDateOnly = (dateKey: string) => new Date(dateKey.slice(0, 10));

const dateKeyToRange = (dateKey: string) => {
  const start = new Date(dateKey);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(dateKey);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

const normalizeTolerancePct = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

@Injectable()
export class StreakService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string, clientDate?: string) {
    const todayKey = clientDate || toDateKey(new Date());
    const todayMonthKey = todayKey.slice(0, 7);

    let streak = await this.prisma.userStreak.findUnique({ where: { userId } });

    // Inicialização do Streak se não existir
    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          streakCount: 0,
          livesRemaining: DEFAULT_MAX_LIVES_PER_MONTH,
          maxLivesPerMonth: DEFAULT_MAX_LIVES_PER_MONTH,
          flameLevel: 'low',
          livesMonthKey: todayMonthKey,
        },
      });
    }

    // Reset mensal de vidas
    if (streak.livesMonthKey !== todayMonthKey) {
      streak = await this.prisma.userStreak.update({
        where: { userId },
        data: {
          livesRemaining: streak.maxLivesPerMonth,
          livesMonthKey: todayMonthKey,
        },
      });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);
    const lastProcessedKey = streak.lastProcessedDate
      ? toDateKey(streak.lastProcessedDate)
      : null;

    let preferences: UserPreferences | null = null;
    if (!lastProcessedKey || lastProcessedKey <= yesterdayKey) {
      preferences = await this.prisma.userPreferences.findUnique({
        where: { userId },
      });
    }

    if (preferences && (!lastProcessedKey || lastProcessedKey < yesterdayKey)) {
      await this.processClosedDay(userId, yesterdayKey, preferences);
      streak =
        (await this.prisma.userStreak.findUnique({ where: { userId } })) ||
        streak;
    }

    if (preferences) {
      await this.maybeRestoreYesterday(userId, yesterdayKey, preferences);
      streak =
        (await this.prisma.userStreak.findUnique({ where: { userId } })) ||
        streak;
    }

    return {
      streak: streak.streakCount,
      livesRemaining: streak.livesRemaining,
      maxLivesPerMonth: streak.maxLivesPerMonth,
      flameLevel: streak.flameLevel as FlameLevel,
    };
  }

  public async processClosedDay(
    userId: string,
    dayKey: string,
    preferences: UserPreferences,
  ) {
    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });
    if (!streak) return;

    if (
      streak.lastProcessedDate &&
      toDateKey(streak.lastProcessedDate) === dayKey
    )
      return;

    const { missingGoals } = await this.evaluateGoalsForDate(
      userId,
      dayKey,
      preferences,
    );
    const contractMet = missingGoals.length === 0;

    let streakAfter = streak.streakCount;
    let livesAfter = streak.livesRemaining;
    let lifeUsed = false;

    if (contractMet) {
      streakAfter++;
    } else if (streak.streakCount > 0 && livesAfter > 0) {
      lifeUsed = true;
      livesAfter--;
      streakAfter++;
    } else {
      streakAfter = 0;
      livesAfter = streak.maxLivesPerMonth;
    }

    await this.prisma.$transaction([
      this.prisma.userStreak.update({
        where: { userId },
        data: {
          streakCount: streakAfter,
          livesRemaining: livesAfter,
          lastProcessedDate: dateKeyToDateOnly(dayKey),
        },
      }),
      this.prisma.userStreakDay.upsert({
        where: { userId_date: { userId, date: dateKeyToDateOnly(dayKey) } },
        update: {
          contractMet,
          missingGoals: missingGoals as any,
          lifeUsed,
          streakAfter,
          livesAfter,
        },
        create: {
          userId,
          date: dateKeyToDateOnly(dayKey),
          contractMet,
          missingGoals: missingGoals as any,
          lifeUsed,
          streakBefore: streak.streakCount,
          streakAfter,
          livesBefore: streak.livesRemaining,
          livesAfter,
        },
      }),
    ]);
  }

  private async maybeRestoreYesterday(
    userId: string,
    yesterdayKey: string,
    preferences: UserPreferences,
  ) {
    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });
    if (!streak?.lastProcessedDate) return;

    const lastKey = toDateKey(streak.lastProcessedDate);
    if (lastKey !== yesterdayKey) return;

    const day = await this.prisma.userStreakDay.findUnique({
      where: { userId_date: { userId, date: dateKeyToDateOnly(yesterdayKey) } },
    });

    if (!day || day.contractMet) return;

    const { missingGoals } = await this.evaluateGoalsForDate(
      userId,
      yesterdayKey,
      preferences,
    );
    if (missingGoals.length !== 0) return;

    let nextLives = streak.livesRemaining;
    let nextStreak = streak.streakCount;

    if (day.lifeUsed) {
      nextLives = Math.min(streak.maxLivesPerMonth, nextLives + 1);
    } else if (day.streakAfter === 0 && day.streakBefore > 0) {
      nextStreak = day.streakBefore + 1;
    } else if (day.streakAfter === 0 && day.streakBefore === 0) {
      nextStreak = 1;
    }

    await this.prisma.$transaction([
      this.prisma.userStreak.update({
        where: { userId },
        data: { livesRemaining: nextLives, streakCount: nextStreak },
      }),
      this.prisma.userStreakDay.update({
        where: {
          userId_date: { userId, date: dateKeyToDateOnly(yesterdayKey) },
        },
        data: {
          contractMet: true,
          missingGoals: [],
          lifeUsed: false,
          livesAfter: nextLives,
          streakAfter: nextStreak,
        },
      }),
    ]);
  }

  private async evaluateGoalsForDate(
    userId: string,
    dateKey: string,
    p: UserPreferences,
  ) {
    const { start, end } = dateKeyToRange(dateKey);
    const dateOnly = dateKeyToDateOnly(dateKey);

    const [nutritionSum, waterSum, sleepLog, tasks, workoutLog] =
      await Promise.all([
        p.nutritionEnabled
          ? this.prisma.dailyFoodLog.aggregate({
              where: { userId, date: { gte: start, lte: end } },
              _sum: { kcal: true },
            })
          : Promise.resolve(null),
        p.waterEnabled
          ? this.prisma.waterLog.aggregate({
              where: { userId, date: { gte: start, lte: end } },
              _sum: { amount: true },
            })
          : Promise.resolve(null),
        p.sleepEnabled
          ? this.prisma.sleepLog.findUnique({
              where: { userId_date: { userId, date: dateOnly } },
            })
          : Promise.resolve(null),
        p.tasksEnabled
          ? this.prisma.task.findMany({
              where: {
                userId,
                OR: [{ isDaily: true }, { targetDate: dateOnly }],
              },
            })
          : Promise.resolve([] as any[]),
        p.workoutEnabled
          ? this.prisma.workoutLog.findFirst({
              where: { userId, date: { gte: start, lte: end } },
              orderBy: { date: 'desc' },
            })
          : Promise.resolve(null as any),
      ]);

    const missingGoals: GoalKey[] = [];

    if (p.nutritionEnabled) {
      const kcal = Number(nutritionSum?._sum.kcal || 0);
      const target = Math.round(
        (Number(p.calorieGoal || 0) *
          normalizeTolerancePct(p.nutritionTolerance, 95)) /
          100,
      );
      if (kcal < target) missingGoals.push('nutrition');
    }

    if (p.waterEnabled) {
      const ml = Number(waterSum?._sum.amount || 0);
      const target = Math.round(
        (Number(p.waterGoal || 0) *
          normalizeTolerancePct(p.waterTolerance, 80)) /
          100,
      );
      if (ml < target) missingGoals.push('water');
    }

    if (p.sleepEnabled) {
      const hours = Number(sleepLog?.durationHours || 0);
      const target = Number(
        (
          (Number(p.sleepGoal || 0) *
            normalizeTolerancePct(p.sleepTolerance, 85)) /
          100
        ).toFixed(1),
      );
      if (hours < target) missingGoals.push('sleep');
    }

    if (p.tasksEnabled && Number(p.tasksGoal || 0) > 0) {
      const completed = (tasks as any[]).filter(
        (t) => t.lastCompletedDate?.toISOString().slice(0, 10) === dateKey,
      ).length;
      if (completed < Number(p.tasksGoal)) missingGoals.push('tasks');
    }

    if (p.workoutEnabled) {
      if (!workoutLog) {
        missingGoals.push('workout');
      } else {
        const exercises =
          ((workoutLog as any)
            .exercises as unknown as WorkoutExerciseLogEntry[]) || [];
        const completed = exercises.filter(
          (ex) => ex?.status && ex.status !== 'failed',
        ).length;
        if (completed === 0) missingGoals.push('workout');
      }
    }

    return { missingGoals };
  }
}
