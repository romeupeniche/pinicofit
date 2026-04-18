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
    nutritionTolerance: number;
    nutritionEnabled: boolean;

    calorieGoal: number;
    proteinGoal: number;
    fatGoal: number;
    carbsGoal: number;
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

    nutritionDeactivatedAt: string | Date | null;
    nutritionCooldownUntil: string | Date | null;

    waterDeactivatedAt: string | Date | null;
    waterCooldownUntil: string | Date | null;

    sleepDeactivatedAt: string | Date | null;
    sleepCooldownUntil: string | Date | null;

    workoutDeactivatedAt: string | Date | null;
    workoutCooldownUntil: string | Date | null;

    tasksDeactivatedAt: string | Date | null;
    tasksCooldownUntil: string | Date | null;

    tutorialState: {
      dashboard: boolean;
      meals: boolean;
      water: boolean;
      workout: boolean;
      sleep: boolean;
      tasks: boolean;
    } & Record<string, boolean>;
    notificationsEmail: string;
    avatar: string | null;
    isEmailVerified: boolean;
    emailAlertsEnabled: boolean;
    emailReportsEnabled: boolean;
  };
  isProfileComplete: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
