export class CreateMealItemDto {
  foodId!: string;
  quantity!: number;
}

export class CreateMealDto {
  name!: string;
  description?: string;
  items!: CreateMealItemDto[];
}
