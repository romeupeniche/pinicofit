import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealsService } from './meals.service';

@Controller('meals')
@UseGuards(AuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  async findAll(
    @Req() req,
    @Query('search') search?: string,
    @Query('source') source?: string,
  ) {
    return this.mealsService.findAll(req.user.sub, search, source);
  }

  @Get('library')
  async getLibrary(@Req() req) {
    return this.mealsService.getLibrary(req.user.sub);
  }

  @Post()
  async create(@Req() req, @Body() body: CreateMealDto) {
    return this.mealsService.createMeal(req.user.sub, body);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() body: UpdateMealDto) {
    return this.mealsService.updateMeal(req.user.sub, id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.mealsService.remove(id, req.user.sub);
  }

  @Post(':id/favorite')
  async toggleFavorite(@Param('id') id: string, @Req() req) {
    return this.mealsService.toggleFavorite(req.user.sub, id);
  }

  @Post(':id/log')
  async logMeal(@Param('id') id: string, @Req() req, @Body('date') date?: string) {
    return this.mealsService.logMeal(req.user.sub, id, date);
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

  @Patch('log/:id')
  async updateLog(
    @Param('id') id: string,
    @Body() data: CreateFoodLogDto,
    @Req() req,
  ) {
    return this.mealsService.updateLog(id, req.user.sub, data);
  }
}
