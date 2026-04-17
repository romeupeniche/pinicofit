import type { ISODateTimeString } from "./common";

export type Task = {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  isDaily: boolean;
  targetDate: ISODateTimeString | null;
  reminderAt: ISODateTimeString | null;
  lastCompletedDate: ISODateTimeString | null;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type TaskDailyViewItem = Task & { completed: boolean };

export type CreateTaskRequest = {
  title: string;
  notes?: string;
  isDaily?: boolean;
  targetDate?: ISODateTimeString | string;
  reminderAt?: ISODateTimeString | string;
};

export type UpdateTaskRequest = {
  title?: string;
  notes?: string;
  isDaily?: boolean;
  targetDate?: ISODateTimeString | string;
  reminderAt?: ISODateTimeString | string;
  completed?: boolean;
  date?: ISODateTimeString | string;
};

