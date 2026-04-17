import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { StreakService } from 'src/streak/streak.service';
import { WaterService } from 'src/water/water.service';
import { MealsService } from 'src/meals/meals.service';
import { WorkoutsService } from 'src/workouts/workouts.service';
import { TasksService } from 'src/tasks/tasks.service';
import { SleepService } from 'src/sleep/sleep.service';
import type {
  DailyFoodLogResponse,
  SleepTodayResponse,
  StreakMeResponse,
  TaskDailyViewItem,
  UserMeResponse,
  WaterTodayResponse,
  WorkoutSettingsResponse,
} from 'src/types';

export type GoalsDailySummaryResponse = {
  me: UserMeResponse;
  streak: StreakMeResponse;
  water: WaterTodayResponse;
  meals: DailyFoodLogResponse;
  workoutSettings: WorkoutSettingsResponse;
  tasks: TaskDailyViewItem[];
  sleep: SleepTodayResponse;
};

const toDateKey = (value?: string) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  return value.slice(0, 10);
};

const toIso = (value: Date | string | null | undefined) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.toISOString();
};

const coerceAllowedMeasures = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const [key, v] of Object.entries(record)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[key] = v;
  }
  return out;
};

@Injectable()
export class GoalsAggregatorService {
  constructor(
    private readonly usersService: UsersService,
    private readonly streakService: StreakService,
    private readonly waterService: WaterService,
    private readonly mealsService: MealsService,
    private readonly workoutsService: WorkoutsService,
    private readonly tasksService: TasksService,
    private readonly sleepService: SleepService,
  ) {}

  async getDailySummary(
    userId: string,
    date?: string,
  ): Promise<GoalsDailySummaryResponse> {
    const dateKey = toDateKey(date);

    const [me, streak, water, meals, workoutSettings, tasks, sleep] =
      await Promise.all([
        this.usersService.findById(userId) as Promise<UserMeResponse>,

        this.streakService.getMe(userId, dateKey) as Promise<StreakMeResponse>,

        this.waterService.getTodayDashboard(userId).then((raw) => ({
          total: raw.total,
          target: raw.target,
          logs: (raw.logs || []).map((log) => ({
            id: log.id,
            userId: log.userId,
            amount: log.amount,
            date: toIso(log.date) ?? new Date().toISOString(),
          })),
        })),

        this.mealsService.getDailyLog(userId, dateKey).then((rows) =>
          rows.map((entry) => ({
            id: entry.id,
            userId: entry.userId,
            foodId: entry.foodId,
            quantity: entry.quantity,
            measure: entry.measure,
            kcal: entry.kcal,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
            date: toIso(entry.date) ?? new Date().toISOString(),
            food: {
              id: entry.food.id,
              userId: entry.food.userId,
              source: entry.food.source,
              brandName: entry.food.brandName,
              brName: entry.food.brName,
              enName: entry.food.enName,
              esName: entry.food.esName,
              kcal: entry.food.kcal,
              protein: entry.food.protein,
              carbs: entry.food.carbs,
              fat: entry.food.fat,
              fiber: entry.food.fiber,
              sodium: entry.food.sodium,
              sugar: entry.food.sugar,
              useML: entry.food.useML,
              density: entry.food.density,
              isPublic: entry.food.isPublic,
              allowedMeasures: coerceAllowedMeasures(
                entry.food.allowedMeasures,
              ),
              category: entry.food.category,
              createdAt:
                toIso(entry.food.createdAt) ?? new Date().toISOString(),
            },
          })),
        ),

        this.workoutsService.getWorkoutSettings(
          userId,
        ) as Promise<WorkoutSettingsResponse>,

        this.tasksService.getDailyView(userId, dateKey).then((rows) =>
          rows.map((task) => ({
            id: task.id,
            userId: task.userId,
            title: task.title,
            notes: task.notes,
            isDaily: task.isDaily,
            targetDate: toIso(task.targetDate),
            reminderAt: toIso(task.reminderAt),
            lastCompletedDate: toIso(task.lastCompletedDate),
            createdAt: toIso(task.createdAt) ?? new Date().toISOString(),
            updatedAt: toIso(task.updatedAt) ?? new Date().toISOString(),
            completed: Boolean(task.completed),
          })),
        ),

        this.sleepService.today(userId, dateKey).then((raw) => {
          if (!raw) return null;
          return {
            id: raw.id,
            userId: raw.userId,
            date: toIso(raw.date) ?? new Date().toISOString(),
            sleptAt: toIso(raw.sleptAt),
            wokeAt: toIso(raw.wokeAt),
            napStart: toIso(raw.napStart),
            napEnd: toIso(raw.napEnd),
            napDurationHours: raw.napDurationHours,
            durationHours: raw.durationHours,
            createdAt: toIso(raw.createdAt) ?? new Date().toISOString(),
            updatedAt: toIso(raw.updatedAt) ?? new Date().toISOString(),
          };
        }),
      ]);

    return {
      me,
      streak,
      water,
      meals,
      workoutSettings,
      tasks,
      sleep,
    };
  }
}
