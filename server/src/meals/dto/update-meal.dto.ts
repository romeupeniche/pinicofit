import { CreateMealDto, CreateMealItemDto } from './create-meal.dto';

export class UpdateMealDto implements Partial<CreateMealDto> {
  name?: string;
  description?: string;
  isPublic?: boolean;
  items?: CreateMealItemDto[];
}
