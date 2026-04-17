import type { ExerciseCategory } from "../constants/workout-metrics";

export type ISODateKey = `${number}-${number}-${number}`;
export type ISODateTimeString = string;

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: string | null;
  goal: string | null;
  isProfileComplete: boolean;
  preferences: GoalsPreferences;
}

export interface GoalsPreferences {
  language: string;
  activityLevel: string | null;

  nutritionEnabled: boolean;
  calorieGoal: number;
  calorieTolerance: number;
  calorieEnabled: boolean;

  proteinGoal: number | null;
  proteinEnabled: boolean;

  carbsGoal: number | null;
  carbsEnabled: boolean;

  fatGoal: number | null;
  fatEnabled: boolean;

  sodiumGoal: number;
  sugarGoal: number;

  waterGoal: number;
  waterTolerance: number;
  waterEnabled: boolean;

  sleepGoal: number;
  sleepTolerance: number;
  sleepEnabled: boolean;

  workoutTolerance: number;
  workoutEnabled: boolean;

  tasksGoal: number;
  tasksEnabled: boolean;

  tutorialState: Record<string, boolean>;
  notificationsEmail: string | null;
  avatar: string | null;
  isEmailVerified: boolean;
  emailAlertsEnabled: boolean;
  emailReportsEnabled: boolean;
}

export interface UpdateGoalsRequest {
  nutritionEnabled: boolean;

  calorieGoal: number | null;
  calorieTolerance: number;
  calorieEnabled: boolean;

  proteinGoal: number | null;
  proteinEnabled: boolean;

  carbsGoal: number | null;
  carbsEnabled: boolean;

  fatGoal: number | null;
  fatEnabled: boolean;

  waterGoal: number;
  waterTolerance: number;
  waterEnabled: boolean;

  sleepGoal: number;
  sleepTolerance: number;
  sleepEnabled: boolean;

  workoutTolerance: number;
  workoutEnabled: boolean;

  tasksGoal: number;
  tasksEnabled: boolean;
}

export interface WaterTodayResponse {
  total: number;
  target: number;
  logs: WaterLog[];
}

export interface WaterLog {
  id: string;
  userId: string;
  amount: number;
  date: ISODateTimeString;
}

export interface DailyFoodLogEntry {
  id: string;
  userId: string;
  foodId: string;
  quantity: number;
  measure: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  date: ISODateTimeString;
  food: Food;
}

export type FoodSource = "TACO" | "PINICODB" | "USER";
export type FoodCategory =
  | "beverage"
  | "fast_food"
  | "dessert"
  | "fruit"
  | "side_dish"
  | "protein"
  | "powders_flours"
  | "vegetables_greens"
  | "sauces_condiments"
  | "dairy"
  | "snack";

export interface Food {
  id: string;
  userId: string | null;
  source: FoodSource;
  brandName: string | null;
  brName: string;
  enName: string;
  esName: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  useML: boolean;
  density: number;
  isPublic: boolean;
  allowedMeasures: Record<string, number>;
  category: FoodCategory;
  createdAt: ISODateTimeString;
}

export interface TaskItem {
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
  completed: boolean;
}

export interface SleepTodayResponse {
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
}

export type ExerciseStatus = "done" | "failed" | "increased";

export interface ExerciseLog {
  date: ISODateKey;
  exerciseId: string;
  status: ExerciseStatus;
  actualWeight?: string;
}

export type WorkoutTechnique =
  | "standard"
  | "Bi-set"
  | "Drop-set"
  | "Rest-Pause";
export type WorkoutExerciseKind = "warmup" | "exercise";

export interface WorkoutExercise {
  id: string;
  group: ExerciseCategory;
  category: WorkoutExerciseKind;
  name: string;
  weight: string;
  technique: WorkoutTechnique;
  sets: string;
  reps: string;
  rest: string;
  obs: string;
}

export interface CycleStep {
  id: string;
  label: string;
  type: "workout" | "rest";
  name: string;
  exercises: WorkoutExercise[];
  isConfigured: boolean;
}

export interface WorkoutHistory {
  startDate: ISODateTimeString;
  endDate: ISODateTimeString;
  cycle: CycleStep[];
}

export interface WorkoutSummary {
  date: ISODateKey;
  calories: number;
  duration: number;
  tonnage: number;
  workoutName: string;
  exercises: Array<
    WorkoutExercise & {
      status: ExerciseStatus;
      actualWeight: string;
    }
  >;
}

export interface WorkoutServerState {
  cycle: CycleStep[];
  startDate: ISODateTimeString;
  history?: WorkoutHistory[];
  logs?: ExerciseLog[];
  summaries?: WorkoutSummary[];
  activeDays?: number[];
}
