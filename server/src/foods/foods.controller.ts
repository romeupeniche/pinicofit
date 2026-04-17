import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('foods')
@UseGuards(AuthGuard)
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  async findAll(
    @Req() req,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(30), ParseIntPipe) take: number,
    @Query('search') search?: string,
    @Query('source') source?: string,
  ) {
    return this.foodsService.findAll(req.user.sub, skip, take, search, source);
  }

  @Get('library')
  async getLibrary(@Req() req) {
    return this.foodsService.getLibrary(req.user.sub);
  }

  @Post()
  async createCustomFood(@Req() req, @Body() body: CreateFoodDto) {
    return this.foodsService.create(req.user.sub, body);
  }

  @Patch(':id')
  async updateCustomFood(
    @Req() req,
    @Param('id') id: string,
    @Body() body: UpdateFoodDto,
  ) {
    return this.foodsService.update(req.user.sub, id, body);
  }

  @Delete(':id')
  async removeCustomFood(@Req() req, @Param('id') id: string) {
    return this.foodsService.remove(req.user.sub, id);
  }

  @Post(':id/favorite')
  async toggleFavorite(@Req() req, @Param('id') id: string) {
    return this.foodsService.toggleFavorite(req.user.sub, id);
  }
}
