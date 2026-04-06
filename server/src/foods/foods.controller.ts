import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';
import { AuthGuard } from 'src/auth/auth.guard';

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

  @Post()
  async createCustomFood(@Req() req, @Body() body: CreateFoodDto) {
    return this.foodsService.create(req.user.sub, body);
  }
}
