import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { Injectable } from '@nestjs/common';
import { CreateFoodLogDto } from './dto/create-food-log.dto';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.meal.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMeal(userId: string, data: CreateMealDto) {
    return this.prisma.meal.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        userId: userId,
        items: {
          create: data.items.map((item) => ({
            foodId: item.foodId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            food: true,
          },
        },
      },
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
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  async getDailyLog(userId: string, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.dailyFoodLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        food: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async removeLog(logId: string, userId: string) {
    const log = await this.prisma.dailyFoodLog.findFirst({
      where: {
        id: logId,
        userId,
      },
    });

    if (!log) {
      return null;
    }

    return this.prisma.dailyFoodLog.delete({
      where: {
        id: logId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.mealItem.deleteMany({
      where: { mealId: id },
    });

    return this.prisma.meal.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}
