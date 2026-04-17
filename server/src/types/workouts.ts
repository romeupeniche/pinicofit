import type { ISODateTimeString } from "./common";

export type ExerciseCategory =
  | "LEGS_COMPOUND"
  | "LEGS_ISOLATED"
  | "BACK_COMPOUND"
  | "CHEST_COMPOUND"
  | "SHOULDERS"
  | "BICEPS_ISOLATED"
  | "TRICEPS_ISOLATED"
  | "ABS_CORE"
  | "CALI_UPPER_COMPOUND"
  | "CALI_LOWER_COMPOUND"
  | "CALI_CORE_ADVANCED"
  | "CARDIO_HIIT"
  | "CARDIO_STEADY"
  | "OTHER";

export type WorkoutExerciseType = "warmup" | "exercise";

export type WorkoutTechnique = "standard" | "Bi-set" | "Drop-set" | "Rest-Pause";

export type ExerciseStatus = "done" | "failed" | "increased";

export type WorkoutExercise = {
  id: string;
  group: ExerciseCategory;
  category: WorkoutExerciseType;
  name: string;
  weight: string;
  technique: WorkoutTechnique;
  sets: string;
  reps: string;
  rest: string;
  obs: string;
};

export type CycleStepType = "workout" | "rest";

export type WorkoutCycleStep = {
  id: string;
  label: string;
  type: CycleStepType;
  name: string;
  exercises: WorkoutExercise[];
  isConfigured: boolean;
};

export type WorkoutHistoryEntry = {
  startDate: ISODateTimeString;
  endDate: ISODateTimeString;
  cycle: WorkoutCycleStep[];
};

export type WorkoutExerciseLogEntry = {
  date: ISODateTimeString;
  exerciseId: string;
  status: ExerciseStatus;
  actualWeight?: string;
};

export type WorkoutSummaryExercise = WorkoutExercise & {
  status: ExerciseStatus;
  actualWeight: string;
};

export type WorkoutSummary = {
  date: ISODateTimeString;
  calories: number;
  duration: number;
  tonnage: number;
  workoutName: string;
  exercises: WorkoutSummaryExercise[];
};

export type WorkoutSettingsState = {
  cycle: WorkoutCycleStep[];
  startDate: ISODateTimeString;
  history: WorkoutHistoryEntry[];
  logs: WorkoutExerciseLogEntry[];
  summaries?: WorkoutSummary[];
  activeDays?: number[];
};

export type WorkoutLogExercises = WorkoutExerciseLogEntry[] | WorkoutCycleStep[];

export type WorkoutLog = {
  id: string;
  userId: string;
  name: string;
  exercises: WorkoutLogExercises;
  duration: number | null;
  date: ISODateTimeString;
};

export type LogWorkoutRequest = {
  name: string;
  exercises: WorkoutLogExercises;
  duration?: number;
  date?: ISODateTimeString | string;
  startDate?: ISODateTimeString | string;
};

export type WorkoutSettingsResponse = WorkoutSettingsState | null;

export type WorkoutSettingsUpdateRequest = Partial<WorkoutSettingsState>;

export type WorkoutSettingsRecord = {
  id: string;
  userId: string;
  state: WorkoutSettingsState;
  updatedAt: ISODateTimeString;
};

export type WorkoutTodayResponse = WorkoutLog | null;
export type WorkoutHistoryResponse = WorkoutLog[];
