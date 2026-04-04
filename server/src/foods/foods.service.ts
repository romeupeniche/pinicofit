import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query?: string, source?: any) {
    return await this.prisma.food.findMany({
      where: {
        AND: [
          {
            OR: [{ userId: null }, { userId: userId }],
          },

          source ? { source: source } : {},

          query
            ? {
                OR: [
                  { brName: { contains: query, mode: 'insensitive' } },
                  { enName: { contains: query, mode: 'insensitive' } },
                  { esName: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: { brName: 'asc' },
    });
  }

  async create(userId: string, data: CreateFoodDto) {
    return await this.prisma.food.create({
      data: {
        brName: data.brName,

        enName: data.enName ?? data.brName,
        esName: data.esName ?? data.brName,

        kcal: data.kcal,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        category: data.category,
        useML: data.useML,
        density: data.density,
        allowedMeasures: data.allowedMeasures,
        brandName: data.brandName ?? '',
        fiber: data.fiber ?? 0,
        sodium: data.sodium ?? 0,
        sugar: data.sugar ?? 0,

        userId: userId,
        source: 'USER',
        isPublic: data.isPublic ?? false,
      },
    });
  }
}
