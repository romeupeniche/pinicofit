import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class LogSleepDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  sleptAt?: string;

  @IsOptional()
  @IsDateString()
  wokeAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  durationHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  napDurationHours?: number;

  @IsOptional()
  @IsDateString()
  napStart?: string;

  @IsOptional()
  @IsDateString()
  napEnd?: string;
}
