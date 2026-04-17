export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  age?: number;
  weight?: number;
  height?: number;
  gender?: "male" | "female" | "other";
  goal?: "bulk" | "cut" | "maintain";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "intense";
  language?: "en" | "br" | "es";
  waterGoal?: number;
  calorieGoal?: number | null;
  proteinGoal?: number | null;
  carbsGoal?: number | null;
  fatGoal?: number | null;
  sodiumGoal?: number | null;
  sugarGoal?: number | null;
  sleepGoal?: number | null;
  tasksGoal?: number | null;
  notificationsEmail?: string | null;
  isEmailVerified?: boolean;
  emailAlertsEnabled?: boolean;
  emailReportsEnabled?: boolean;
  tutorialState?: {
    dashboard?: boolean;
    meals?: boolean;
    water?: boolean;
    workout?: boolean;
    sleep?: boolean;
    tasks?: boolean;
  };
  preferences: {
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

    language: string;
    updatedAt?: string | Date;
  };
  isProfileComplete: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
