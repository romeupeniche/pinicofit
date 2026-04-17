import { PrismaService } from 'src/prisma/prisma.service';
import { LogWaterDto } from './dto/log-water.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaterService {
  constructor(private prisma: PrismaService) {}

  private toDateKey(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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
      select: {
        userPreferences: {
          select: { waterGoal: true },
        },
      },
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
      target: user?.userPreferences?.waterGoal || 2000,
      logs: logs,
    };
  }

  async getWeeklyHistory(userId: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const logs = await this.prisma.waterLog.findMany({
      where: {
        userId,
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        userPreferences: {
          select: { waterGoal: true },
        },
      },
    });

    const goal = user?.userPreferences?.waterGoal || 2000;

    return Array.from({ length: 7 }, (_, index) => {
      const current = new Date(sevenDaysAgo);
      current.setDate(sevenDaysAgo.getDate() + index);
      const key = this.toDateKey(current);
      const dayLogs = logs.filter((log) => this.toDateKey(log.date) === key);

      return {
        id: key,
        date: current.toISOString(),
        amount: dayLogs.reduce((sum, log) => sum + log.amount, 0),
        goal: goal,
      };
    })
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.id.localeCompare(a.id));
  }

  async getMonthHistory(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await this.prisma.waterLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        userPreferences: {
          select: { waterGoal: true },
        },
      },
    });

    const goal = user?.userPreferences?.waterGoal || 2000;

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
      goal: goal,
    }));
  }
}
