import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LogWaterDto {
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsOptional()
  @IsString()
  date?: string;
}
