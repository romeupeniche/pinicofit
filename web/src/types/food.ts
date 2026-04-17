export interface BackendFood {
  id: string;
  userId?: string | null;
  brandName?: string;
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
  allowedMeasures: Record<string, number>;
  useML: boolean;
  density?: number;
  category?: string;
  isPublic?: boolean;
  isFavorite?: boolean;
  source: "TACO" | "PINICODB" | "USER";
}
