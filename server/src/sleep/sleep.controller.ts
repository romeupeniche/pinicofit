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
import { AuthGuard } from 'src/auth/auth.guard';
import { SleepService } from './sleep.service';
import { LogSleepDto } from './dto/log-sleep.dto';

@Controller('sleep')
@UseGuards(AuthGuard)
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Get('today')
  today(@Req() req: { user: { sub: string } }, @Query('date') date?: string) {
    return this.sleepService.today(req.user.sub, date);
  }

  @Get('history')
  history(
    @Req() req: { user: { sub: string } },
    @Query('period') period: 'week' | 'month' = 'week',
  ) {
    return this.sleepService.history(req.user.sub, period || 'week');
  }

  @Post('log')
  log(@Req() req: { user: { sub: string } }, @Body() body: LogSleepDto) {
    return this.sleepService.log(req.user.sub, body);
  }

  @Delete('log/:id')
  remove(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.sleepService.remove(req.user.sub, id);
  }
}
