import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(['cash', 'bank', 'e-wallet'])
  type: string;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  userId: string;
}

export class Account {
  id: number;
  user_id: number;
  name: string;
  type: string;
  balance: number;
  created_at: Date;
}