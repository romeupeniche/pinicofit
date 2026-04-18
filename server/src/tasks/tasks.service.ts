import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: [
        { isDaily: 'desc' },
        { targetDate: { sort: 'asc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
    });
  }

  async getDailyView(userId: string, date: string) {
    const targetDate = new Date(date.slice(0, 10));

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        OR: [{ isDaily: true }, { targetDate: { lte: targetDate } }],
      },
      orderBy: [{ isDaily: 'desc' }, { createdAt: 'asc' }],
    });

    return tasks.map((task) => {
      const isCompleted =
        task.lastCompletedDate?.toISOString().slice(0, 10) ===
        date.slice(0, 10);
      const isOverdue =
        !task.isDaily &&
        task.targetDate &&
        task.targetDate.toISOString().slice(0, 10) < date.slice(0, 10) &&
        !isCompleted;

      return {
        ...task,
        completed: isCompleted,
        isOverdue: isOverdue,
      };
    });
  }

  async create(userId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        notes: data.notes,
        isDaily: data.isDaily ?? false,
        targetDate: data.targetDate
          ? new Date(data.targetDate.slice(0, 10))
          : null,
        reminderAt: data.reminderAt ? new Date(data.reminderAt) : null,
      },
    });
  }

  async update(userId: string, id: string, data: UpdateTaskDto) {
    const existing = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    let lastCompletedDate = existing.lastCompletedDate;

    if (data.completed === true) {
      lastCompletedDate = new Date(
        (data.date || new Date().toISOString()).slice(0, 10),
      );
    } else if (data.completed === false) {
      lastCompletedDate = null;
    }

    const isDaily = data.isDaily ?? existing.isDaily;

    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        notes: data.notes ?? existing.notes,
        isDaily: isDaily,
        targetDate: isDaily
          ? null
          : data.targetDate
            ? new Date(data.targetDate.slice(0, 10))
            : existing.targetDate,
        reminderAt:
          data.reminderAt === ''
            ? null
            : data.reminderAt
              ? new Date(data.reminderAt)
              : existing.reminderAt,
        lastCompletedDate,
      },
    });
  }

  async remove(userId: string, id: string) {
    try {
      await this.prisma.task.delete({
        where: { id, userId },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }
}
