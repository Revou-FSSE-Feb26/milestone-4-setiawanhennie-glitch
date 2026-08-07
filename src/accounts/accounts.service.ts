import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';
import { BalanceCalculatorService } from 'src/balance/balance-calculator.service';
import { TransactionType } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../auth/dto/auth.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private calculator: BalanceCalculatorService,
  ) {}

  // CREATE
  async createFor(user: JwtPayload, dto: CreateAccountDto) {
    const ownerId = this.isAdmin(user) && dto.userId ? dto.userId : user.sub;
    return this.prisma.account.create({
      data: {
        user_id: ownerId,
        name: dto.name,
        type: dto.type,
        balance: dto.balance ?? 0,
      },
    });
  }

  // READ ALL
  async findAll() {
    return this.prisma.account.findMany();
  }

  // READ ONE
  async findOne(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  // FIND BY USER
  async findByUserId(userId: number) {
    return this.prisma.account.findMany({
      where: { user_id: userId },
    });
  }

  // UPDATE
  async update(id: number, dto: UpdateAccountDto) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  async delete(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.prisma.account.delete({
      where: { id },
    });
  }

  // BALANCE UPDATE (for transactions)
  async updateBalance(accountId: number, amount: number, type: string) {
    const account = await this.findOne(accountId);
    let newBalance = account.balance.toNumber();

    if (type === 'income') {
      newBalance += amount;
    } else if (type === 'expense') {
      newBalance -= amount;
    }

    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });
  }

  // GET CURRENT BALANCE
  async getBalance(accountId: number) {
    const account = await this.findOne(accountId);
    return account.balance.toNumber();
  }

  // Add to AccountsService

  async findAllWithTransactions() {
    return this.prisma.account.findMany({
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findOneWithTransactions(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

    // Apply a transaction's effect to the balance
  async applyToBalance(accountId: number, type: TransactionType, amount: number) {
    const account = await this.findOne(accountId);
    const balance = this.calculator.apply(account.balance.toNumber(), type, amount);
    return this.prisma.account.update({ where: { id: accountId }, data: { balance } });
  }

  // Undo a transaction's effect on the balance
  async reverseOnBalance(accountId: number, type: TransactionType, amount: number) {
    const account = await this.findOne(accountId);
    const balance = this.calculator.reverse(account.balance.toNumber(), type, amount);
    return this.prisma.account.update({ where: { id: accountId }, data: { balance } });
  }

  private isAdmin(user: JwtPayload) {
  return user.role === 'admin';
}

  async findAllFor(user: JwtPayload) {
    return this.prisma.account.findMany({
      where: this.isAdmin(user) ? {} : { user_id: user.sub },
    });
  }

  async findOneFor(user: JwtPayload, id: number) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    if (!this.isAdmin(user) && account.user_id !== user.sub) {
      throw new ForbiddenException('You do not own this account');
    }
    return account;
  }

  async updateFor(user: JwtPayload, id: number, dto: UpdateAccountDto) {
    await this.findOneFor(user, id); // ownership check
    return this.prisma.account.update({ where: { id }, data: dto });
  }

  async deleteFor(user: JwtPayload, id: number) {
    await this.findOneFor(user, id); // ownership check
    await this.prisma.account.delete({ where: { id } });
    return { message: `Account ${id} deleted successfully` };
  }
}