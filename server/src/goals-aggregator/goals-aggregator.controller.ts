import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GoalsAggregatorService } from './goals-aggregator.service';

@Controller('goals')
@UseGuards(AuthGuard)
export class GoalsAggregatorController {
  constructor(private readonly goalsAggregatorService: GoalsAggregatorService) {}

  @Get('daily-summary')
  async getDailySummary(
    @Req() req: { user: { sub: string } },
    @Query('date') date?: string,
  ) {
    return this.goalsAggregatorService.getDailySummary(req.user.sub, date);
  }
}

