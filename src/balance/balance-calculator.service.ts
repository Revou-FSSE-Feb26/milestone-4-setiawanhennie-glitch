import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class BalanceCalculatorService {
  delta(type: TransactionType, amount: number): number {
    if (type === TransactionType.income) return amount;
    if (type === TransactionType.expense) return -amount;
    return 0;
  }

  apply(current: number, type: TransactionType, amount: number): number {
    return current + this.delta(type, amount);
  }

  reverse(current: number, type: TransactionType, amount: number): number {
    return current - this.delta(type, amount);
  }
}