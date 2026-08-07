import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionType } from '@prisma/client';
import { JwtPayload } from '../auth/dto/auth.dto';
import { ForbiddenException } from '@nestjs/common';

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

    if (dto.type === TransactionType.income || dto.type === TransactionType.expense) {
      await this.accountsService.applyToBalance(dto.accountId, dto.type, dto.amount);
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
      where: { type: type as TransactionType },
    });
  }

  async update(id: number, dto: UpdateTransactionDto) {
    const oldTransaction = await this.findOne(id);

    // Reverse old transaction's effect on balance
    if (oldTransaction.type === TransactionType.income || oldTransaction.type === TransactionType.expense) {
      await this.accountsService.reverseOnBalance(
        oldTransaction.account_id,
        oldTransaction.type,
        oldTransaction.amount.toNumber(),
      );
    }

    // Update the transaction
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

    // Apply new transaction's effect on balance
    const effType = dto.type ?? updatedTransaction.type;
    const effAccountId = dto.accountId ?? oldTransaction.account_id;
    const effAmount = dto.amount ?? updatedTransaction.amount.toNumber();
    
    if (effType === TransactionType.income || effType === TransactionType.expense) {
      await this.accountsService.applyToBalance(effAccountId, effType, effAmount);
    }

    return updatedTransaction;
  }

  async delete(id: number) {
    const transaction = await this.findOne(id);

    // Reverse transaction's effect on balance
    if (transaction.type === TransactionType.income || transaction.type === TransactionType.expense) {
      await this.accountsService.reverseOnBalance(
        transaction.account_id,
        transaction.type,
        transaction.amount.toNumber(),
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
      where: { type: type as TransactionType },
      include: {
        category: true,
      },
    });
  }

  private isAdmin(user: JwtPayload) {
  return user.role === 'admin';
}

private scopeWhere(user: JwtPayload) {
  return this.isAdmin(user) ? {} : { account: { user_id: user.sub } };
}

private async assertOwnsAccount(user: JwtPayload, accountId: number) {
  const account = await this.prisma.account.findUnique({ where: { id: accountId } });
  if (!account) throw new NotFoundException(`Account with ID ${accountId} not found`);
  if (!this.isAdmin(user) && account.user_id !== user.sub) {
    throw n…iption: dto.description,
      transaction_date: dto.transaction_date ? new Date(dto.transaction_date) : undefined,
    },
  });

  // Apply new effect
  const effType = dto.type ?? updated.type;
  const effAccountId = dto.accountId ?? old.account_id;
  const effAmount = dto.amount ?? updated.amount.toNumber();
  if (effType === TransactionType.income || effType === TransactionType.expense) {
    await this.accountsService.applyToBalance(effAccountId, effType, effAmount);
  }
  return updated;
}
async deleteFor(user: JwtPayload, id: number) {
  const t = await this.getOwnedTransaction(user, id);

  if (t.type === TransactionType.income || t.type === TransactionType.expense) {
    await this.accountsService.reverseOnBalance(
      t.account_id, t.type, t.amount.toNumber(),
    );
  }

  await this.prisma.transaction.delete({ where: { id } });
  return { message: `Transaction ${id} deleted successfully` };
}
}