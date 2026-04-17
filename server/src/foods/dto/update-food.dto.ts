import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto implements Partial<CreateFoodDto> {
  brandName?: string;
  brName?: string;
  enName?: string;
  esName?: string;
  kcal?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  allowedMeasures?: Record<string, number>;
  category?: any;
  useML?: boolean;
  density?: number;
  source?: any;
  isPublic?: boolean;
}
