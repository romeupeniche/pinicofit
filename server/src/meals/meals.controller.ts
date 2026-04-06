import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateFoodLogDto } from './dto/create-food-log.dto';

@Controller('meals')
@UseGuards(AuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}
  @Get()
  async findAll(@Req() req) {
    return this.mealsService.findAll(req.user.sub);
  }

  @Post()
  async create(@Req() req, @Body() body: CreateMealDto) {
    return this.mealsService.createMeal(req.user.sub, body);
  }
  @Post('log')
  async logFood(@Body() data: CreateFoodLogDto, @Req() req) {
    return this.mealsService.createLog(req.user.sub, data);
  }

  @Get('log')
  async getDailyLog(@Req() req, @Query('date') date: string) {
    const targetDate = date || new Date().toISOString();
    return this.mealsService.getDailyLog(req.user.sub, targetDate);
  }

  @Delete('log/:id')
  async removeLog(@Param('id') id: string, @Req() req) {
    return this.mealsService.removeLog(id, req.user.sub);
  }
}
