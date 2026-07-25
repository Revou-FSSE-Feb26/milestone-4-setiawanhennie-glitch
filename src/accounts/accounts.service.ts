import { Injectable } from '@nestjs/common';
import { Account } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  private mockAccounts: Account[] = [
    {
      id: 1,
      user_id: 1,
      name: 'Alice Checking',
      type: 'bank',
      balance: 2500.00,
      created_at: new Date('2026-07-01'),
    },
    {
      id: 2,
      user_id: 1,
      name: 'Alice Savings',
      type: 'bank',
      balance: 10000.00,
      created_at: new Date('2026-07-01'),
    },
    {
      id: 3,
      user_id: 1,
      name: 'Alice Cash',
      type: 'cash',
      balance: 150.00,
      created_at: new Date('2026-07-01'),
    },
    {
      id: 4,
      user_id: 2,
      name: 'Bob Main Account',
      type: 'bank',
      balance: 1800.50,
      created_at: new Date('2026-07-01'),
    },
    {
      id: 5,
      user_id: 2,
      name: 'Bob E-Wallet',
      type: 'e-wallet',
      balance: 300.00,
      created_at: new Date('2026-07-01'),
    },
    {
      id: 6,
      user_id: 3,
      name: 'Carol Business',
      type: 'bank',
      balance: 15000.00,
      created_at: new Date('2026-07-01'),
    },
  ];

  findAll(): Account[] {
    return this.mockAccounts;
  }

  findOne(id: number): Account | undefined {
    return this.mockAccounts.find(account => account.id === id);
  }

  findByUserId(userId: number): Account[] {
    return this.mockAccounts.filter(account => account.user_id === userId);
  }
}