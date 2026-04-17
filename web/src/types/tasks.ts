export interface TaskItem {
  id: string;
  title: string;
  notes?: string | null;
  isDaily: boolean;
  targetDate?: string | null;
  reminderAt?: string | null;
  lastCompletedDate?: string | null;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}
