import type { ISODateTimeString } from "./common";

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

export type AllowedMeasures = Record<string, number>;

export type BackendFood = {
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
  allowedMeasures: AllowedMeasures;
  category: FoodCategory;

  createdAt: ISODateTimeString;
  isFavorite?: boolean;
};

export type FoodsListResponse = BackendFood[];

export type FoodFavoriteToggleResponse = { isFavorite: boolean };

export type FoodsLibraryResponse = {
  created: BackendFood[];
  favorites: BackendFood[];
};

export type CreateFoodRequest = {
  brandName?: string;
  brName: string;
  enName?: string;
  esName?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  allowedMeasures: AllowedMeasures;
  useML?: boolean;
  density?: number;
  category: FoodCategory;
  isPublic?: boolean;
};

export type UpdateFoodRequest = Partial<CreateFoodRequest>;

