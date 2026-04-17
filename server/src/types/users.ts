import type {
  ActivityLevel,
  Gender,
  GoalType,
  ISODateTimeString,
  LanguageCode,
} from "./common";

export type TutorialState = {
  dashboard: boolean;
  meals: boolean;
  water: boolean;
  workout: boolean;
  sleep: boolean;
  tasks: boolean;
} & Record<string, boolean>;

export type UserPreferencesResponse = {
  language: LanguageCode;
  activityLevel: ActivityLevel | null;

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

  tutorialState: TutorialState;
  notificationsEmail: string;
  avatar: string | null;
  isEmailVerified: boolean;
  emailAlertsEnabled: boolean;
  emailReportsEnabled: boolean;
};

export type UserMeResponse = {
  id: string;
  name: string;
  email: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: Gender | string | null;
  goal: GoalType | string | null;
  isProfileComplete: boolean;
  preferences: UserPreferencesResponse;
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: Gender;
  goal?: GoalType;
  activityLevel?: ActivityLevel;
  tutorialState?: Partial<TutorialState>;
  notificationsEmail?: string;
  avatar?: string | null;
  emailAlertsEnabled?: boolean;
  emailReportsEnabled?: boolean;
  isProfileComplete?: boolean;
};

export type UpdateGoalsRequest = {
  nutritionEnabled: boolean;
  calorieGoal: number;
  calorieTolerance: number;
  calorieEnabled: boolean;
  proteinGoal: number;
  proteinEnabled: boolean;
  carbsGoal: number;
  carbsEnabled: boolean;
  fatGoal: number;
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
};

export type EmailLang = LanguageCode;

export type SendVerificationRequest = { lang?: EmailLang };

export type SendTestReportRequest = {
  lang?: EmailLang;
  recipientEmail?: string;
  recipientName?: string;
};

export type HelpReportRequest = {
  subject?: string;
  message?: string;
  lang?: EmailLang;
};

export type SimpleSuccessResponse = { success: true };

export type EmailVerificationResponse = { success: true };

export type MonthlyReportDispatchRecord = {
  id: string;
  userId: string;
  monthKey: string;
  sentAt: ISODateTimeString;
};
