import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateFoodDto } from './dto/create-food.dto';

@Controller('foods')
@UseGuards(AuthGuard)
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  async getFoods(
    @Req() req,
    @Query('search') search: string,
    @Query('source') source: string,
  ) {
    return this.foodsService.findAll(req.user.sub, search, source);
  }

  @Post()
  async createCustomFood(@Req() req, @Body() body: CreateFoodDto) {
    return this.foodsService.create(req.user.sub, body);
  }
}
