import type { ISODateTimeString } from "./common";
import type { BackendFood } from "./foods";

export type RecipeIngredient = {
  id: string;
  recipeId: string;
  foodId: string;
  quantity: number;
  measure: string;
  food: BackendFood;
};

export type Recipe = {
  id: string;
  userId: string | null;
  title: string;
  description: string | null;
  instructions: string;
  imageUrl: string | null;
  source: string | null;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: ISODateTimeString;
  ingredients: RecipeIngredient[];
};

export type RecipesListResponse = Recipe[];
export type RecipeResponse = Recipe | null;

export type CreateRecipeRequest = {
  title: string;
  description?: string;
  instructions: string;
  imageUrl?: string;
  source?: string;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  ingredients: Array<{
    foodId: string;
    quantity: number;
    measure: string;
  }>;
};

