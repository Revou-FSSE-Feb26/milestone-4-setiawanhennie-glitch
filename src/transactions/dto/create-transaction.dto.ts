import { IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountId: string;

  @IsString()
  categoryId: string;

  @IsEnum(['income', 'expense', 'transfer'])
  type: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  transaction_date: string;
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