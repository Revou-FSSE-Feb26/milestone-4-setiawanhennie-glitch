import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  accountId: number;

  @IsNumber()
  categoryId: number;

  @IsEnum(TransactionType)
  type: TransactionType;

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
  @IsNumber() @IsOptional() accountId?: number;
  @IsNumber() @IsOptional() categoryId?: number;
  @IsEnum(TransactionType) @IsOptional() type?: TransactionType;
  @IsNumber() @Min(0.01) @IsOptional() amount?: number;
  @IsString() @IsOptional() description?: string;
  @IsDateString() @IsOptional() transaction_date?: string;
}