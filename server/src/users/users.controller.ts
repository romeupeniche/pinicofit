import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
}
