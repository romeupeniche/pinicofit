import type { ISODateTimeString } from "./common";

export type SleepLog = {
  id: string;
  userId: string;
  date: ISODateTimeString;
  sleptAt: ISODateTimeString | null;
  wokeAt: ISODateTimeString | null;
  napStart: ISODateTimeString | null;
  napEnd: ISODateTimeString | null;
  napDurationHours: number;
  durationHours: number;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type LogSleepRequest = {
  date?: ISODateTimeString | string;
  sleptAt?: ISODateTimeString | string;
  wokeAt?: ISODateTimeString | string;
  durationHours?: number;
  napDurationHours?: number;
  napStart?: ISODateTimeString | string;
  napEnd?: ISODateTimeString | string;
};

export type SleepTodayResponse = SleepLog | null;
export type SleepHistoryResponse = SleepLog[];

