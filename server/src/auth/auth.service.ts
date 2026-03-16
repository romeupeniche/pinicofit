import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateJwt(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      isProfileComplete: user.isProfileComplete,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
      },
    };
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('server.errors.auth.email_not_found');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('server.errors.auth.incorrect_password');
    }

    return this.generateJwt(user);
  }
}
