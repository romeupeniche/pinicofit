import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { LogWorkoutDto } from './dto/log-workout.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post('log')
  async log(@Req() req, @Body() data: LogWorkoutDto) {
    return this.workoutsService.logWorkout(req.user.sub, data);
  }

  @Get('history')
  async history(@Req() req) {
    return this.workoutsService.getHistory(req.user.sub);
  }

  @Get('today')
  async today(@Req() req, @Query('date') date?: string) {
    return this.workoutsService.getTodayWorkout(req.user.sub, date);
  }

  @Get('presets')
  async getPresets(@Req() req) {
    return this.workoutsService.getUserPresets(req.user.sub);
  }

  @Post('presets')
  async createPreset(@Req() req, @Body() preset: { name: string; exercises: unknown }) {
    return this.workoutsService.createPreset(req.user.sub, preset);
  }

  @Delete('presets/:id')
  async deletePreset(@Req() req, @Param('id') id: string) {
    return this.workoutsService.deletePreset(req.user.sub, id);
  }

  @Delete('log/:id')
  async deleteLog(@Req() req, @Param('id') id: string) {
    return this.workoutsService.deleteWorkoutLog(req.user.sub, id);
  }

  @Get('settings')
  async getSettings(@Req() req) {
    return this.workoutsService.getWorkoutSettings(req.user.sub);
  }

  @Patch('settings')
  async updateSettings(@Req() req, @Body() settings: any) {
    return this.workoutsService.updateWorkoutSettings(req.user.sub, settings);
  }
}
