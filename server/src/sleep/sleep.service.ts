import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogSleepDto } from './dto/log-sleep.dto';

@Injectable()
export class SleepService {
  constructor(private readonly prisma: PrismaService) {}

  private parseLocalDate(value?: string) {
    const source = value
      ? value.slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const [year, month, day] = source.split('-').map(Number);
    return new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  }

  private resolveSleepPayload(data: LogSleepDto) {
    const date = this.parseLocalDate(data.date);
    let sleptAt = data.sleptAt ? new Date(data.sleptAt) : null;
    let wokeAt = data.wokeAt ? new Date(data.wokeAt) : null;
    let durationHours =
      data.durationHours !== undefined ? Number(data.durationHours) : null;
    let napStart = data.napStart ? new Date(data.napStart) : null;
    let napEnd = data.napEnd ? new Date(data.napEnd) : null;
    let napDurationHours =
      data.napDurationHours !== undefined ? Number(data.napDurationHours) : 0;

    if (sleptAt && wokeAt && durationHours === null) {
      durationHours = (wokeAt.getTime() - sleptAt.getTime()) / (1000 * 60 * 60);
    }
    if (sleptAt && durationHours !== null && !wokeAt) {
      wokeAt = new Date(sleptAt.getTime() + durationHours * 60 * 60 * 1000);
    }
    if (wokeAt && durationHours !== null && !sleptAt) {
      sleptAt = new Date(wokeAt.getTime() - durationHours * 60 * 60 * 1000);
    }
    if (napStart && napEnd && !napDurationHours) {
      napDurationHours =
        (napEnd.getTime() - napStart.getTime()) / (1000 * 60 * 60);
    }
    if (napStart && napDurationHours && !napEnd) {
      napEnd = new Date(napStart.getTime() + napDurationHours * 60 * 60 * 1000);
    }
    if (napEnd && napDurationHours && !napStart) {
      napStart = new Date(napEnd.getTime() - napDurationHours * 60 * 60 * 1000);
    }

    return {
      date,
      sleptAt,
      wokeAt,
      napStart,
      napEnd,
      napDurationHours: Number((napDurationHours || 0).toFixed(2)),
      durationHours: Number(
        ((durationHours || 0) + (napDurationHours || 0)).toFixed(2),
      ),
    };
  }

  async log(userId: string, data: LogSleepDto) {
    const payload = this.resolveSleepPayload(data);

    return this.prisma.sleepLog.upsert({
      where: {
        userId_date: {
          userId,
          date: payload.date,
        },
      },
      update: {
        sleptAt: payload.sleptAt,
        wokeAt: payload.wokeAt,
        napStart: payload.napStart,
        napEnd: payload.napEnd,
        napDurationHours: payload.napDurationHours,
        durationHours: payload.durationHours,
      },
      create: {
        userId,
        ...payload,
      },
    });
  }

  async today(userId: string, date?: string) {
    const targetDate = this.parseLocalDate(date);

    return this.prisma.sleepLog.findUnique({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
    });
  }

  async history(userId: string, period: 'week' | 'month') {
    const days = period === 'week' ? 7 : 30;
    const sinceDate = new Date();
    sinceDate.setHours(0, 0, 0, 0);
    sinceDate.setDate(sinceDate.getDate() - (days - 1));

    return this.prisma.sleepLog.findMany({
      where: {
        userId,
        date: { gte: sinceDate },
      },
      orderBy: { date: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    return this.prisma.sleepLog.delete({
      where: { id, userId },
    });
  }
}
