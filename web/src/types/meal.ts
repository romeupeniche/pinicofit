import type { BackendFood } from "./food";

export interface BackendMealItem {
  id: string;
  mealId: string;
  foodId: string;
  quantity: number;
  food: BackendFood;
}

export interface BackendMeal {
  id: string;
  userId?: string | null;
  name: string;
  description?: string | null;
  isPublic?: boolean;
  isFavorite?: boolean;
  items: BackendMealItem[];
  createdAt?: string;
}
