import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  Transaction, 
  CreateTransactionDto, 
  UpdateTransactionDto 
} from './dto/create-transaction.dto';
import { AccountsService } from '../accounts/accounts.service';

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

  private nextId = 6;

  constructor(private readonly accountsService: AccountsService) {}

  // CREATE (with balance update)
  create(dto: CreateTransactionDto): Transaction {
    const newTransaction: Transaction = {
      id: this.nextId++,
      account_id: dto.accountId,
      category_id: dto.categoryId,
      type: dto.type,
      amount: dto.amount,
      description: dto.description || '',
      transaction_date: new Date(dto.transaction_date),
      created_at: new Date(),
    };

    this.mockTransactions.push(newTransaction);

    // Update account balance
    if (dto.type === 'income' || dto.type === 'expense') {
      this.accountsService.updateBalance(
        dto.accountId,
        dto.amount,
        dto.type
      );
    }

    return newTransaction;
  }

  // READ ALL
  findAll(): Transaction[] {
    return this.mockTransactions;
  }

  // READ ONE
  findOne(id: number): Transaction {
    const transaction = this.mockTransactions.find(t => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // FIND BY ACCOUNT
  findByAccountId(accountId: number): Transaction[] {
    return this.mockTransactions.filter(t => t.account_id === accountId);
  }

  // FIND BY TYPE
  findByType(type: string): Transaction[] {
    return this.mockTransactions.filter(t => t.type === type);
  }

  // UPDATE (with balance recalculation)
  update(id: number, dto: UpdateTransactionDto): Transaction {
    const transactionIndex = this.mockTransactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const oldTransaction = this.mockTransactions[transactionIndex];

    // Reverse the old transaction's effect on balance
    if (oldTransaction.type === 'income' || oldTransaction.type === 'expense') {
      const reverseAmount = oldTransaction.type === 'income' 
        ? -oldTransaction.amount 
        : oldTransaction.amount;
      this.accountsService.updateBalance(
        oldTransaction.account_id,
        reverseAmount,
        oldTransaction.type === 'income' ? 'expense' : 'income'
      );
    }

    // Update the transaction
    const updatedTransaction: Transaction = {
      ...oldTransaction,
      ...dto,
      transaction_date: dto.transaction_date 
        ? new Date(dto.transaction_date) 
        : oldTransaction.transaction_date,
    };

    this.mockTransactions[transactionIndex] = updatedTransaction;

    // Apply the new transaction's effect on balance
    if (dto.type === 'income' || dto.type === 'expense') {
      this.accountsService.updateBalance(
        dto.accountId || oldTransaction.account_id,
        dto.amount || updatedTransaction.amount,
        dto.type || updatedTransaction.type
      );
    }

    return updatedTransaction;
  }

  // DELETE (with balance recalculation)
  delete(id: number): void {
    const transactionIndex = this.mockTransactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const transaction = this.mockTransactions[transactionIndex];

    // Reverse the transaction's effect on balance
    if (transaction.type === 'income' || transaction.type === 'expense') {
      const reverseAmount = transaction.type === 'income' 
        ? -transaction.amount 
        : transaction.amount;
      this.accountsService.updateBalance(
        transaction.account_id,
        reverseAmount,
        transaction.type === 'income' ? 'expense' : 'income'
      );
    }

    this.mockTransactions.splice(transactionIndex, 1);
  }
}