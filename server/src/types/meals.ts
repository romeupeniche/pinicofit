import type { ISODateTimeString } from "./common";
import type { BackendFood } from "./foods";

export type MealFavorite = {
  id: string;
  userId: string;
  mealId: string;
  createdAt: ISODateTimeString;
};

export type MealItem = {
  id: string;
  mealId: string;
  foodId: string;
  quantity: number;
  food: BackendFood;
};

export type Meal = {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  isPublic: boolean;
  items: MealItem[];
  createdAt: ISODateTimeString;
  isFavorite?: boolean;
  mealFavorites?: MealFavorite[];
};

export type MealsListResponse = Meal[];

export type MealsLibraryResponse = {
  created: Meal[];
  favorites: Meal[];
};

export type MealFavoriteToggleResponse = { isFavorite: boolean };

export type LogMealResponse = { success: true };

export type CreateMealRequest = {
  name: string;
  description?: string;
  isPublic?: boolean;
  items: Array<{
    foodId: string;
    quantity: number;
  }>;
};

export type UpdateMealRequest = {
  name?: string;
  description?: string | null;
  isPublic?: boolean;
  items?: Array<{
    foodId: string;
    quantity: number;
  }>;
};

export type FoodLogEntryBase = {
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
};

export type FoodLogEntryWithFood = FoodLogEntryBase & { food: BackendFood };

export type CreateFoodLogRequest = {
  foodId: string;
  quantity: number;
  measure: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  date?: ISODateTimeString | string;
};

export type DailyFoodLogResponse = FoodLogEntryWithFood[];
