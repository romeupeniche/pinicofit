export class CreateIngredientDto {
  foodId!: string;
  quantity!: number;
  measure!: string;
}

export class CreateRecipeDto {
  title!: string;
  description?: string;
  instructions!: string;
  imageUrl?: string;
  source?: string;

  ingredients!: CreateIngredientDto[];

  totalKcal!: number;
  totalProtein!: number;
  totalCarbs!: number;
  totalFat!: number;
}
