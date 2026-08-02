import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  accountId: number;

  @IsNumber()
  categoryId: number;

  @IsEnum(['income', 'expense', 'transfer'])
  type: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  transaction_date: string;
}

export class UpdateTransactionDto {
  @IsNumber()
  @IsOptional()
  accountId?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsEnum(['income', 'expense', 'transfer'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  transaction_date?: string;
}

export class Transaction {
  id: number;
  account_id: number;
  category_id: number;
  type: string;
  amount: number;
  description: string;
  transaction_date: Date;
  created_at: Date;
}