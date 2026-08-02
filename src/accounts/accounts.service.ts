import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';

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

  private nextId = 7;

  // CREATE
  create(dto: CreateAccountDto): Account {
    const newAccount: Account = {
      id: this.nextId++,
      user_id: dto.userId,
      name: dto.name,
      type: dto.type,
      balance: dto.balance || 0,
      created_at: new Date(),
    };
    this.mockAccounts.push(newAccount);
    return newAccount;
  }

  // READ ALL
  findAll(): Account[] {
    return this.mockAccounts;
  }

  // READ ONE
  findOne(id: number): Account {
    const account = this.mockAccounts.find(acc => acc.id === id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  // FIND BY USER
  findByUserId(userId: number): Account[] {
    return this.mockAccounts.filter(acc => acc.user_id === userId);
  }

  // UPDATE
  update(id: number, dto: UpdateAccountDto): Account {
    const accountIndex = this.mockAccounts.findIndex(acc => acc.id === id);
    if (accountIndex === -1) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    this.mockAccounts[accountIndex] = {
      ...this.mockAccounts[accountIndex],
      ...dto,
    };

    return this.mockAccounts[accountIndex];
  }

  // DELETE
  delete(id: number): void {
    const accountIndex = this.mockAccounts.findIndex(acc => acc.id === id);
    if (accountIndex === -1) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    this.mockAccounts.splice(accountIndex, 1);
  }

  // BALANCE UPDATE (for transactions)
  updateBalance(accountId: number, amount: number, type: string): Account {
    const account = this.findOne(accountId);
    const accountIndex = this.mockAccounts.findIndex(acc => acc.id === accountId);

    if (type === 'income') {
      this.mockAccounts[accountIndex].balance += amount;
    } else if (type === 'expense') {
      this.mockAccounts[accountIndex].balance -= amount;
    }
    return this.mockAccounts[accountIndex];
  }

  // GET CURRENT BALANCE
  getBalance(accountId: number): number {
    const account = this.findOne(accountId);
    return account.balance;
  }
}