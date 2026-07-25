import { Injectable } from '@nestjs/common';
import { Transaction } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  private mockTransactions: Transaction[] = [
    {
      id: 1,
      account_id: 1,
      category_id: 1,
      type: 'income',
      amount: 3500.00,
      description: 'Monthly salary',
      transaction_date: new Date('2026-07-01'),
      created_at: new Date('2026-07-01'),
    },
    {
      id: 2,
      account_id: 1,
      category_id: 4,
      type: 'expense',
      amount: 150.75,
      description: 'Weekly groceries',
      transaction_date: new Date('2026-07-05'),
      created_at: new Date('2026-07-05'),
    },
    {
      id: 3,
      account_id: 1,
      category_id: 5,
      type: 'expense',
      amount: 1200.00,
      description: 'July rent',
      transaction_date: new Date('2026-07-01'),
      created_at: new Date('2026-07-01'),
    },
    {
      id: 4,
      account_id: 1,
      category_id: 6,
      type: 'expense',
      amount: 85.50,
      description: 'Electric bill',
      transaction_date: new Date('2026-07-10'),
      created_at: new Date('2026-07-10'),
    },
    {
      id: 5,
      account_id: 2,
      category_id: 1,
      type: 'income',
      amount: 500.00,
      description: 'Interest payment',
      transaction_date: new Date('2026-07-15'),
      created_at: new Date('2026-07-15'),
    },
  ];

  findAll(): Transaction[] {
    return this.mockTransactions;
  }

  findOne(id: number): Transaction | undefined {
    return this.mockTransactions.find(transaction => transaction.id === id);
  }

  findByAccountId(accountId: number): Transaction[] {
    return this.mockTransactions.filter(
      transaction => transaction.account_id === accountId,
    );
  }

  findByType(type: string): Transaction[] {
    return this.mockTransactions.filter(
      transaction => transaction.type === type,
    );
  }
}