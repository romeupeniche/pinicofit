import { PrismaService } from 'src/prisma/prisma.service';
import { LogWaterDto } from './dto/log-water.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaterService {
  constructor(private prisma: PrismaService) {}

  async logWater(userId: string, data: LogWaterDto) {
    return this.prisma.waterLog.create({
      data: {
        userId,
        amount: data.amount,
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  async removeLog(logId: string, userId: string) {
    return this.prisma.waterLog.delete({
      where: { id: logId, userId: userId },
    });
  }

  async getTodayDashboard(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { waterGoal: true },
    });

    const logs = await this.prisma.waterLog.findMany({
      where: {
        userId,
        date: { gte: startOfDay },
      },
      orderBy: { date: 'desc' },
    });

    const total = logs.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      total,
      target: user?.waterGoal || 2000,
      logs: logs,
    };
  }

  async getWeeklyHistory(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.waterLog.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getMonthHistory(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await this.prisma.waterLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    });

    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return days.map((day) => ({
      day: parseInt(day.split('-')[2]),
      amount: logs
        .filter((l) => l.date.toISOString().split('T')[0] === day)
        .reduce((sum, l) => sum + l.amount, 0),
      goal: 3000,
    }));
  }
}
