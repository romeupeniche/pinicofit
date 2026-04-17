import type { ISODateTimeString } from "./common";

export type WaterLog = {
  id: string;
  userId: string;
  amount: number;
  date: ISODateTimeString;
};

export type LogWaterRequest = {
  amount: number;
  date?: ISODateTimeString | string;
};

export type WaterTodayResponse = {
  total: number;
  target: number;
  logs: WaterLog[];
};

export type WaterHistoryDay = {
  id: string;
  date: ISODateTimeString;
  amount: number;
  goal: number;
};

export type WaterWeeklyHistoryResponse = WaterHistoryDay[];

export type WaterMonthHistoryDay = {
  day: number;
  amount: number;
  goal: number;
};

export type WaterMonthHistoryResponse = WaterMonthHistoryDay[];

