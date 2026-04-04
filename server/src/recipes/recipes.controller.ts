import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Controller('recipes')
@UseGuards(AuthGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async findAll(@Req() req) {
    return this.recipesService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  async create(@Req() req, @Body() body: CreateRecipeDto) {
    return this.recipesService.create(req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.recipesService.remove(id, req.user.sub);
  }
}
