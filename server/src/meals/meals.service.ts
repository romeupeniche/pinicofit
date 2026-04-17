import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  private parseMealLogDate(value?: string) {
    if (!value) return new Date();
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(`${value}T12:00:00`);
    }
    return new Date(value);
  }

  private buildDayRange(value: string) {
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T12:00:00`)
      : new Date(value);

    const start = new Date(parsed);
    start.setHours(0, 0, 0, 0);

    const end = new Date(parsed);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  async findAll(userId: string, search?: string, source?: string) {
    const meals = await this.prisma.meal.findMany({
      where: {
        AND: [
          source === 'USER'
            ? { userId }
            : { OR: [{ userId }, { isPublic: true }] },
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      include: {
        items: { include: { food: true } },
        mealFavorites: { where: { userId } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return meals.map((meal: any) => ({
      ...meal,
      isFavorite: meal.mealFavorites?.length > 0,
    }));
  }

  async getLibrary(userId: string) {
    const [created, favoritesRecords] = await Promise.all([
      this.prisma.meal.findMany({
        where: { userId },
        include: { items: { include: { food: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mealFavorite.findMany({
        where: { userId },
        include: {
          meal: {
            include: { items: { include: { food: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      created: created.map((meal) => ({ ...meal, isFavorite: true })),
      favorites: favoritesRecords.map((record) => ({
        ...record.meal,
        isFavorite: true,
      })),
    };
  }

  async createMeal(userId: string, data: CreateMealDto) {
    return this.prisma.meal.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        isPublic: data.isPublic ?? true,
        userId,
        items: {
          create: data.items.map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { food: true } } },
    });
  }

  async updateMeal(userId: string, mealId: string, data: UpdateMealDto) {
    const meal = await this.prisma.meal.findUnique({ where: { id: mealId } });

    if (!meal) throw new NotFoundException('Meal not found.');
    if (meal.userId !== userId)
      throw new ForbiddenException('You can only edit your own meals.');

    return this.prisma.meal.update({
      where: { id: mealId },
      data: {
        name: data.name ?? meal.name,
        description: data.description ?? meal.description,
        isPublic: data.isPublic ?? meal.isPublic,
        items: {
          deleteMany: {},
          create: (data.items ?? []).map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { food: true } } },
    });
  }

  async createLog(userId: string, data: CreateFoodLogDto) {
    return this.prisma.dailyFoodLog.create({
      data: {
        userId,
        foodId: data.foodId,
        quantity: data.quantity,
        measure: data.measure,
        kcal: data.kcal,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        ...(data.date && { date: this.parseMealLogDate(data.date) }),
      },
    });
  }

  async logMeal(userId: string, mealId: string, date?: string) {
    const meal = await this.prisma.meal.findFirst({
      where: {
        id: mealId,
        OR: [{ userId }, { isPublic: true }],
      },
      include: { items: { include: { food: true } } },
    });

    if (!meal) throw new NotFoundException('Meal not found.');

    const targetDate = this.parseMealLogDate(date);

    await this.prisma.dailyFoodLog.createMany({
      data: meal.items.map((item) => ({
        userId,
        foodId: item.foodId,
        quantity: item.quantity,
        measure: 'metric',
        kcal: (item.food.kcal * item.quantity) / 100,
        protein: (item.food.protein * item.quantity) / 100,
        carbs: (item.food.carbs * item.quantity) / 100,
        fat: (item.food.fat * item.quantity) / 100,
        date: targetDate,
      })),
    });

    return { success: true };
  }

  async getDailyLog(userId: string, date: string) {
    const { start, end } = this.buildDayRange(date);

    return this.prisma.dailyFoodLog.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
      include: { food: true },
      orderBy: { date: 'desc' },
    });
  }

  async removeLog(logId: string, userId: string) {
    const log = await this.prisma.dailyFoodLog.findFirst({
      where: { id: logId, userId },
    });

    if (!log) return null;

    return this.prisma.dailyFoodLog.delete({ where: { id: logId } });
  }

  async updateLog(logId: string, userId: string, data: CreateFoodLogDto) {
    const log = await this.prisma.dailyFoodLog.findFirst({
      where: { id: logId, userId },
    });

    if (!log) return null;

    return this.prisma.dailyFoodLog.update({
      where: { id: logId },
      data: {
        foodId: data.foodId,
        quantity: data.quantity,
        measure: data.measure,
        kcal: data.kcal,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        ...(data.date && { date: this.parseMealLogDate(data.date) }),
      },
    });
  }

  async remove(id: string, userId: string) {
    const meal = await this.prisma.meal.findUnique({ where: { id } });

    if (!meal) throw new NotFoundException('Meal not found.');
    if (meal.userId !== userId)
      throw new ForbiddenException('You can only delete your own meals.');

    return this.prisma.meal.delete({ where: { id } });
  }

  async toggleFavorite(userId: string, mealId: string) {
    const meal = await this.prisma.meal.findUnique({ where: { id: mealId } });
    if (!meal) throw new NotFoundException('Meal not found.');

    const existing = await this.prisma.mealFavorite.findUnique({
      where: {
        userId_mealId: { userId, mealId },
      },
    });

    if (existing) {
      await this.prisma.mealFavorite.delete({ where: { id: existing.id } });
      return { isFavorite: false };
    }

    await this.prisma.mealFavorite.create({
      data: { userId, mealId },
    });

    return { isFavorite: true };
  }
}
