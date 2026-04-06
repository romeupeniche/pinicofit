import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LogWaterDto } from './dto/log-water.dto';
import { WaterService } from './water.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('water')
@UseGuards(AuthGuard)
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Post('log')
  async log(@Req() req, @Body() data: LogWaterDto) {
    return this.waterService.logWater(req.user.sub, data);
  }

  @Get('today')
  async today(@Req() req) {
    return this.waterService.getTodayDashboard(req.user.sub);
  }

  @Delete('log/:id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.waterService.removeLog(id, req.user.sub);
  }

  @Get('history')
  async history(@Req() req, @Query('period') period?: string) {
    if (period === 'month') {
      return this.waterService.getMonthHistory(req.user.sub);
    }

    return this.waterService.getWeeklyHistory(req.user.sub);
  }
}
