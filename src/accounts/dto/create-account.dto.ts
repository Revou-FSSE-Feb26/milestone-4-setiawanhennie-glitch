import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsEnum(['cash', 'bank', 'e-wallet'])
  type: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number = 0;

  @IsNumber()
  @Min(1)
  userId: number;
}

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['cash', 'bank', 'e-wallet'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balance?: number;
}

export class Account {
  id: number;
  user_id: number;
  name: string;
  type: string;
  balance: number;
  created_at: Date;
}