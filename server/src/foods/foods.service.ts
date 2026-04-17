import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    skip: number = 0,
    take: number = 30,
    search?: string,
    source?: string,
  ) {
    if (search) {
      const searchPattern = `%${search}%`;

      return this.prisma.$queryRaw`
        SELECT f.*, 
        EXISTS(SELECT 1 FROM "FoodFavorite" WHERE "userId" = ${userId} AND "foodId" = f.id) as "isFavorite"
        FROM "Food" f
        WHERE (
          unaccent(f."brName") ILIKE unaccent(${searchPattern}) OR 
          unaccent(f."enName") ILIKE unaccent(${searchPattern}) OR
          unaccent(f."esName") ILIKE unaccent(${searchPattern}) OR
          unaccent(f."brandName") ILIKE unaccent(${searchPattern})
        )
        AND (f."isPublic" = true OR f."userId" = ${userId})
        ${
          source && source !== 'global'
            ? source === 'USER'
              ? Prisma.sql`AND f."source" = 'USER' AND f."userId" = ${userId}`
              : Prisma.sql`AND f."source" = ${source}::"FoodSource"`
            : Prisma.empty
        }
        ORDER BY f."brName" ASC
        LIMIT ${take} OFFSET ${skip}
      `;
    }

    const foods = await this.prisma.food.findMany({
      where: {
        AND: [
          { OR: [{ isPublic: true }, { userId: userId }] },
          source && source !== 'global'
            ? source === 'USER'
              ? { source: 'USER', userId }
              : { source: source as any }
            : {},
        ],
      },
      include: {
        foodFavorites: {
          where: { userId },
        },
      },
      orderBy: { brName: 'asc' },
      skip,
      take,
    });

    return foods.map((food) => ({
      id: food.id,
      userId: food.userId,
      source: food.source,
      brandName: food.brandName,
      brName: food.brName,
      enName: food.enName,
      esName: food.esName,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      sodium: food.sodium,
      sugar: food.sugar,
      useML: food.useML,
      density: food.density,
      isPublic: food.isPublic,
      allowedMeasures: food.allowedMeasures,
      category: food.category,
      createdAt: food.createdAt,
      isFavorite: food.foodFavorites.length > 0,
    }));
  }

  async getLibrary(userId: string) {
    const [created, favoritesRecords] = await Promise.all([
      this.prisma.food.findMany({
        where: { userId, source: 'USER' },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.foodFavorite.findMany({
        where: { userId },
        include: { food: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      created: created.map((food) => ({
        id: food.id,
        userId: food.userId,
        source: food.source,
        brandName: food.brandName,
        brName: food.brName,
        enName: food.enName,
        esName: food.esName,
        kcal: food.kcal,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
        sodium: food.sodium,
        sugar: food.sugar,
        useML: food.useML,
        density: food.density,
        isPublic: food.isPublic,
        allowedMeasures: food.allowedMeasures,
        category: food.category,
        createdAt: food.createdAt,
        isFavorite: true,
      })),
      favorites: favoritesRecords.map((record) => ({
        id: record.food.id,
        userId: record.food.userId,
        source: record.food.source,
        brandName: record.food.brandName,
        brName: record.food.brName,
        enName: record.food.enName,
        esName: record.food.esName,
        kcal: record.food.kcal,
        protein: record.food.protein,
        carbs: record.food.carbs,
        fat: record.food.fat,
        fiber: record.food.fiber,
        sodium: record.food.sodium,
        sugar: record.food.sugar,
        useML: record.food.useML,
        density: record.food.density,
        isPublic: record.food.isPublic,
        allowedMeasures: record.food.allowedMeasures,
        category: record.food.category,
        createdAt: record.food.createdAt,
        isFavorite: true,
      })),
    };
  }

  async create(userId: string, data: CreateFoodDto) {
    return this.prisma.food.create({
      data: {
        userId: userId,
        source: 'USER',
        brandName: data.brandName ?? '',
        brName: data.brName,
        enName: data.enName ?? data.brName,
        esName: data.esName ?? data.brName,
        kcal: data.kcal,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        fiber: data.fiber,
        sodium: data.sodium,
        sugar: data.sugar,
        category: data.category,
        allowedMeasures: data.allowedMeasures as any,
        useML: data.useML ?? false,
        density: data.density ?? 1.0,
        isPublic: data.isPublic ?? false,
      },
    });
  }

  async update(userId: string, id: string, data: UpdateFoodDto) {
    const food = await this.prisma.food.findUnique({ where: { id } });

    if (!food) throw new NotFoundException('Food not found.');
    if (food.userId !== userId || food.source !== 'USER') {
      throw new ForbiddenException('You can only edit your own custom foods.');
    }

    return this.prisma.food.update({
      where: { id },
      data: {
        brandName: data.brandName ?? food.brandName,
        brName: data.brName ?? food.brName,
        enName: data.enName ?? data.brName ?? food.enName,
        esName: data.esName ?? data.brName ?? food.esName,
        kcal: data.kcal ?? food.kcal,
        protein: data.protein ?? food.protein,
        carbs: data.carbs ?? food.carbs,
        fat: data.fat ?? food.fat,
        fiber: data.fiber ?? food.fiber,
        sodium: data.sodium ?? food.sodium,
        sugar: data.sugar ?? food.sugar,
        category: data.category ?? food.category,
        allowedMeasures: (data.allowedMeasures as any) ?? food.allowedMeasures,
        useML: data.useML ?? food.useML,
        density: data.density ?? food.density,
        isPublic: data.isPublic ?? food.isPublic,
      },
    });
  }

  async remove(userId: string, id: string) {
    const food = await this.prisma.food.findUnique({ where: { id } });

    if (!food) throw new NotFoundException('Food not found.');
    if (food.userId !== userId || food.source !== 'USER') {
      throw new ForbiddenException(
        'You can only delete your own custom foods.',
      );
    }

    return this.prisma.food.delete({ where: { id } });
  }

  async toggleFavorite(userId: string, foodId: string) {
    const food = await this.prisma.food.findUnique({ where: { id: foodId } });
    if (!food) throw new NotFoundException('Food not found.');

    const existing = await this.prisma.foodFavorite.findUnique({
      where: {
        userId_foodId: { userId, foodId },
      },
    });

    if (existing) {
      await this.prisma.foodFavorite.delete({
        where: { id: existing.id },
      });
      return { isFavorite: false };
    }

    await this.prisma.foodFavorite.create({
      data: { userId, foodId },
    });

    return { isFavorite: true };
  }
}
