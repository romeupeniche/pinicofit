import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'server.errors.users.invalid_email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'server.errors.users.invalid_password' })
  password: string;

  @IsString()
  name: string;
}
