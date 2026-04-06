import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateFoodLogDto {
  @IsUUID()
  @IsNotEmpty()
  foodId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  measure!: string;

  @IsNumber()
  @IsNotEmpty()
  kcal!: number;

  @IsNumber()
  @IsNotEmpty()
  protein!: number;

  @IsNumber()
  @IsNotEmpty()
  carbs!: number;

  @IsNumber()
  @IsNotEmpty()
  fat!: number;

  @IsOptional()
  @IsString()
  date?: string;
}
