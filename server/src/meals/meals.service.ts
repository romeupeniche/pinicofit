import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { Injectable } from '@nestjs/common';

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
