import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { Injectable } from '@nestjs/common';
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
      let sourceFilter = Prisma.sql`AND ("isPublic" = true OR "userId" = ${userId})`;
      if (source && source !== 'global') {
        if (source === 'USER') {
          sourceFilter = Prisma.sql`AND "source" = 'USER' AND "userId" = ${userId}`;
        } else {
          sourceFilter = Prisma.sql`AND "source" = ${source}::"FoodSource"`;
        }
      }

      return this.prisma.$queryRaw`
        SELECT * FROM "Food"
        WHERE (
          unaccent("brName") ILIKE unaccent(${searchPattern}) OR 
          unaccent("enName") ILIKE unaccent(${searchPattern}) OR
          unaccent("esName") ILIKE unaccent(${searchPattern}) OR
          unaccent("brandName") ILIKE unaccent(${searchPattern})
        )
        ${sourceFilter}
        ORDER BY "brName" ASC
        LIMIT ${take} OFFSET ${skip}
      `;
    }

    const whereClause: any = {
      AND: [],
    };

    if (source && source !== 'global') {
      whereClause.AND.push({ source: source as any });
      if (source === 'USER') whereClause.AND.push({ userId: userId });
    } else {
      whereClause.AND.push({ OR: [{ isPublic: true }, { userId: userId }] });
    }

    return this.prisma.food.findMany({
      where: whereClause,
      orderBy: { brName: 'asc' },
      skip,
      take,
    });
  }

  async create(userId: string, data: CreateFoodDto) {
    return await this.prisma.food.create({
      data: {
        ...data,
        enName: data.enName ?? data.brName,
        esName: data.esName ?? data.brName,
        brandName: data.brandName ?? '',
        userId,
        source: 'USER',
        isPublic: data.isPublic ?? false,
      },
    });
  }
}
