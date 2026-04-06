export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: "male" | "female" | "other";
  goal?: "bulk" | "cut" | "maintain";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "intense";
  waterGoal?: number;
  calorieGoal?: number | null;
  proteinGoal?: number | null;
  carbsGoal?: number | null;
  fatGoal?: number | null;
  sodiumGoal?: number | null;
  sugarGoal?: number | null;
  sleepGoal?: number | null;
  stepsGoal?: number | null;
  notificationsEmail?: string | null;
  isEmailVerified?: boolean;
  emailAlertsEnabled?: boolean;
  emailReportsEnabled?: boolean;
  tutorialState?: {
    dashboard?: boolean;
    meals?: boolean;
    water?: boolean;
    workout?: boolean;
  };
  isProfileComplete: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
