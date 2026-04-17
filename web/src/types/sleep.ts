export interface SleepLog {
  id: string;
  date: string;
  sleptAt?: string | null;
  wokeAt?: string | null;
  napStart?: string | null;
  napEnd?: string | null;
  napDurationHours?: number;
  durationHours: number;
  createdAt: string;
  updatedAt: string;
}
