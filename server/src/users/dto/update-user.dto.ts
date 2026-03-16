import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNumber()
  @Min(30)
  weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  height?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsString()
  goal?: string;
}
