import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { StreakService } from './streak.service';

@Controller('streak')
@UseGuards(AuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get('me')
  async me(@Req() req: any, @Query('date') date?: string) {
    return this.streakService.getMe(req.user.sub, date);
  }
}

