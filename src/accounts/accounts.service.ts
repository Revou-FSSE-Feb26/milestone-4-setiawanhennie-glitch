import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        user_id: dto.userId,
        name: dto.name,
        type: dto.type,
        balance: dto.balance || 0,
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
}