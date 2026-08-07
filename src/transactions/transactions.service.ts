import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { JwtPayload } from '../auth/dto/auth.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private accountsService: AccountsService,
  ) {}

  // ---------- helpers ----------

  private isAdmin(user: JwtPayload) {
    return user.role === 'admin';
  }

  private scopeWhere(user: JwtPayload) {
    return this.isAdmin(user) ? {} : { account: { user_id: user.sub } };
  }

  private async assertOwnsAccount(user: JwtPayload, accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    if (!this.isAdmin(user) && account.user_id !== user.sub) {
      throw new ForbiddenException('You do not own this account');
    }
    return account;
  }

  private async getOwnedTransaction(user: JwtPayload, id: number) {
    const t = await this.prisma.transaction.findUnique({
      where: { id },
      include: { account: true },
    });
    if (!t) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if (!this.isAdmin(user) && t.account.user_id !== user.sub) {
      throw new ForbiddenException('You do not own this transaction');
    }
    return t;
  }

  async createFor(user: JwtPayload, dto: CreateTransactionDto) {
    await this.assertOwnsAccount(user, dto.accountId);

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

    if (
      dto.type === TransactionType.income ||
      dto.type === TransactionType.expense
    ) {
      await this.accountsService.applyToBalance(
        dto.accountId,
        dto.type,
        dto.amount,
      );
    }
    return transaction;
  }

  async findAllFor(user: JwtPayload) {
    return this.prisma.transaction.findMany({ where: this.scopeWhere(user) });
  }

  async findAllWithCategoryFor(user: JwtPayload) {
    return this.prisma.transaction.findMany({
      where: this.scopeWhere(user),
      include: { category: true },
    });
  }

  async findByTypeFor(user: JwtPayload, type: string) {
    return this.prisma.transaction.findMany({
      where: { ...this.scopeWhere(user), type: type as TransactionType },
    });
  }

  async findByTypeWithCategoryFor(user: JwtPayload, type: string) {
    return this.prisma.transaction.findMany({
      where: { ...this.scopeWhere(user), type: type as TransactionType },
      include: { category: true },
    });
  }

  async findByAccountIdFor(user: JwtPayload, accountId: number) {
    await this.assertOwnsAccount(user, accountId);
    return this.prisma.transaction.findMany({
      where: { account_id: accountId },
    });
  }

  async findOneFor(user: JwtPayload, id: number, withCategory: boolean) {
    const t = await this.getOwnedTransaction(user, id);
    if (withCategory) {
      return this.prisma.transaction.findUnique({
        where: { id },
        include: { category: true },
      });
    }
    const { account, ...rest } = t;
    return rest;
  }

  async updateFor(user: JwtPayload, id: number, dto: UpdateTransactionDto) {
    const old = await this.getOwnedTransaction(user, id);
    if (dto.accountId && dto.accountId !== old.account_id) {
      await this.assertOwnsAccount(user, dto.accountId);
    }

    // Reverse old effect
    if (
      old.type === TransactionType.income ||
      old.type === TransactionType.expense
    ) {
      await this.accountsService.reverseOnBalance(
        old.account_id,
        old.type,
        old.amount.toNumber(),
      );
    }

    const updated = await this.prisma.transaction.update({
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

    // Apply new effect
    const effType = dto.type ?? updated.type;
    const effAccountId = dto.accountId ?? old.account_id;
    const effAmount = dto.amount ?? updated.amount.toNumber();
    if (
      effType === TransactionType.income ||
      effType === TransactionType.expense
    ) {
      await this.accountsService.applyToBalance(
        effAccountId,
        effType,
        effAmount,
      );
    }
    return updated;
  }

  async deleteFor(user: JwtPayload, id: number) {
    const t = await this.getOwnedTransaction(user, id);

    if (
      t.type === TransactionType.income ||
      t.type === TransactionType.expense
    ) {
      await this.accountsService.reverseOnBalance(
        t.account_id,
        t.type,
        t.amount.toNumber(),
      );
    }

    await this.prisma.transaction.delete({ where: { id } });
    return { message: `Transaction ${id} deleted successfully` };
  }
}