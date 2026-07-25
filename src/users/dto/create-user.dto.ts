import { IsString, IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['user', 'admin'])
  role: string;
}

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}