import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class LogWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  exercises!: Record<string, unknown>[];

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  date?: string;
}
