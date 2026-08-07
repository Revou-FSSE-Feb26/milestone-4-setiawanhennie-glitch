import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        account_id: dto.accountId,
        category_id: dto.categoryId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        transaction_date: new Date(dto.transaction_date),
      },
    });

    // Update account balance
    if (dto.type === 'income' || dto.type === 'expense') {
      await this.accountsService.updateBalance(
        dto.accountId,
        dto.amount,
        dto.type,
      );
    }

    return transaction;
  }

  async findAll() {
    return this.prisma.transaction.findMany();
  }

  async findOne(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findByAccountId(accountId: number) {
    return this.prisma.transaction.findMany({
      where: { account_id: accountId },
    });
  }

  async findByType(type: string) {
    return this.prisma.transaction.findMany({
      where: { type },
    });
  }

  async update(id: number, dto: UpdateTransactionDto) {
    const oldTransaction = await this.findOne(id);

    // Reverse old transaction's effect
    if (oldTransaction.type === 'income' || oldTransaction.type === 'expense') {
      const reverseAmount = oldTransaction.type === 'income' 
        ? -oldTransaction.amount.toNumber() 
        : oldTransaction.amount.toNumber();
      await this.accountsService.updateBalance(
        oldTransaction.account_id,
        reverseAmount,
        oldTransaction.type === 'income' ? 'expense' : 'income',
      );
    }

    // Update transaction
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        account_id: dto.accountId,
        category_id: dto.categoryId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        transaction_date: dto.transaction_date 
          ? new Date(dto.transaction_date) 
          : undefined,
      },
    });

    // Apply new transaction's effect
    if (dto.type === 'income' || dto.type === 'expense') {
      await this.accountsService.updateBalance(
        dto.accountId || oldTransaction.account_id,
        dto.amount || updatedTransaction.amount.toNumber(),
        dto.type || updatedTransaction.type,
      );
    }

    return updatedTransaction;
  }

  async delete(id: number) {
    const transaction = await this.findOne(id);

    // Reverse transaction's effect
    if (transaction.type === 'income' || transaction.type === 'expense') {
      const reverseAmount = transaction.type === 'income' 
        ? -transaction.amount.toNumber() 
        : transaction.amount.toNumber();
      await this.accountsService.updateBalance(
        transaction.account_id,
        reverseAmount,
        transaction.type === 'income' ? 'expense' : 'income',
      );
    }

    await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async findAllWithCategory() {
  return this.prisma.transaction.findMany({
    include: {
      category: true,
    },
  });
}

  async findOneWithCategory(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findByTypeWithCategory(type: string) {
    return this.prisma.transaction.findMany({
      where: { type },
      include: {
        category: true,
      },
    });
  }
}