import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogWorkoutDto } from './dto/log-workout.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async logWorkout(userId: string, data: LogWorkoutDto) {
    const referenceDate = data.date ? new Date(data.date) : new Date();
    const start = new Date(referenceDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(referenceDate);
    end.setHours(23, 59, 59, 999);

    const existingLog = await this.prisma.workoutLog.findFirst({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'desc' },
    });

    const payload = {
      name: data.name,
      exercises: data.exercises as unknown as Prisma.InputJsonValue,
      duration: data.duration,
      date: referenceDate,
    };

    if (existingLog) {
      return this.prisma.workoutLog.update({
        where: { id: existingLog.id },
        data: payload,
      });
    }

    return this.prisma.workoutLog.create({
      data: {
        userId,
        ...payload,
      },
    });
  }

  async getHistory(userId: string) {
    return this.prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  async getTodayWorkout(userId: string, clientDate?: string) {
    const referenceDate = clientDate ? new Date(clientDate) : new Date();

    const start = new Date(referenceDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(referenceDate);
    end.setHours(23, 59, 59, 999);

    return this.prisma.workoutLog.findFirst({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async deleteWorkoutLog(userId: string, id: string) {
    const log = await this.prisma.workoutLog.findFirst({
      where: { id, userId },
    });

    if (!log) throw new NotFoundException('Log de treino não encontrado');

    return this.prisma.workoutLog.delete({
      where: { id },
    });
  }

  async getUserPresets(userId: string) {
    return this.prisma.workoutPreset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPreset(
    userId: string,
    data: { name: string; exercises: unknown },
  ) {
    return this.prisma.workoutPreset.create({
      data: {
        userId,
        name: data.name,
        exercises: data.exercises as Prisma.InputJsonValue,
      },
    });
  }

  async deletePreset(userId: string, id: string) {
    const preset = await this.prisma.workoutPreset.findFirst({
      where: { id, userId },
    });

    if (!preset) {
      throw new NotFoundException('Preset de treino nÃ£o encontrado');
    }

    return this.prisma.workoutPreset.delete({
      where: { id },
    });
  }

  async getWorkoutSettings(userId: string) {
    const settings = await this.prisma.workoutSettings.findUnique({
      where: { userId },
    });

    return settings ? settings.state : null;
  }

  async updateWorkoutSettings(userId: string, state: any) {
    return this.prisma.workoutSettings.upsert({
      where: { userId },
      update: {
        state: state as unknown as Prisma.InputJsonValue,
      },
      create: {
        userId,
        state: state as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
