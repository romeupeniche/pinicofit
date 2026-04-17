import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

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

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  waterGoal?: number;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsIn(['en', 'br', 'es'])
  language?: 'en' | 'br' | 'es';

  @IsOptional()
  @IsNumber()
  @Min(1000)
  calorieGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  proteinGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbsGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fatGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sodiumGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sugarGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sleepGoal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tasksGoal?: number;

  @IsOptional()
  @IsEmail()
  notificationsEmail?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  emailAlertsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  emailReportsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  isProfileComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  recalculateGoals?: boolean;

  @IsOptional()
  @IsObject()
  tutorialState?: Record<string, boolean>;

  @IsOptional()
  @IsString()
  avatar?: string;
}
