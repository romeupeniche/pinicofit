import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.generateJwt(user);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: { user: { sub: string } }) {
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.usersService.update(id, req.user.sub, updateUserDto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.usersService.verifyEmailToken(token);
  }

  @UseGuards(AuthGuard)
  @Post(':id/notifications/send-verification')
  sendVerification(
    @Param('id') id: string,
    @Body() body: { lang?: 'en' | 'br' | 'es' },
    @Req() req: { user: { sub: string } },
  ) {
    return this.usersService.sendVerificationEmail(
      id,
      req.user.sub,
      body?.lang,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id/notifications/test-report')
  sendTestReport(
    @Param('id') id: string,
    @Body()
    body: {
      lang?: 'en' | 'br' | 'es';
      recipientEmail?: string;
      recipientName?: string;
    },
    @Req() req: { user: { sub: string } },
  ) {
    return this.usersService.sendTestReport(id, req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Post(':id/help-report')
  sendHelpReport(
    @Param('id') id: string,
    @Body()
    body: { subject?: string; message?: string; lang?: 'en' | 'br' | 'es' },
    @Req() req: { user: { sub: string } },
  ) {
    return this.usersService.sendHelpReport(id, req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Patch('preferences/goals')
  async updateGoals(
    @Body() goalsData: any,
    @Req() req: { user: { sub: string } },
  ) {
    return this.usersService.updateGoals(req.user.sub, goalsData);
  }
}
