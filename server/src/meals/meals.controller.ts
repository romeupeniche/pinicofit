import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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
}
