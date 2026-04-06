export interface BackendFood {
  id: string;
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
  source: "TACO" | "PINICODB" | "USER";
}
