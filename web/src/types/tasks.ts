export interface TaskItem {
  id: string;
  title: string;
  notes?: string | null;
  isDaily: boolean;
  targetDate?: string | null;
  reminderAt?: string | null;
  lastCompletedDate?: string | null;
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
  isOverdue?: boolean;
}
