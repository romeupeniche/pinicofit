import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.recipe.findMany({
      where: {
        OR: [{ userId: null }, { userId: userId }],
      },
      include: {
        ingredients: {
          include: {
            food: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    });
  }

  async create(userId: string, data: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        instructions: data.instructions,
        imageUrl: data.imageUrl ?? null,
        source: data.source ?? 'USER',
        userId: userId,
        totalKcal: data.totalKcal,
        totalProtein: data.totalProtein,
        totalCarbs: data.totalCarbs,
        totalFat: data.totalFat,
        ingredients: {
          create: data.ingredients.map((ing) => ({
            foodId: ing.foodId,
            quantity: ing.quantity,
            measure: ing.measure,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    return this.prisma.recipe.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}
