import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction, UpdateTransactionDto, CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto): Transaction {
    return this.transactionsService.create(dto);
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('account_id') accountId?: string,
    @Query('include') include?: string,
  ) {
    if (accountId) {
      return this.transactionsService.findByAccountId(Number(accountId));
    }
    if (type) {
      if (include === 'category') {
        return this.transactionsService.findByTypeWithCategory(type);
      }
      return this.transactionsService.findByType(type);
    }
    if (include === 'category') {
      return this.transactionsService.findAllWithCategory();
    }
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include') include?: string,
  ) {
    if (include === 'category') {
      return this.transactionsService.findOneWithCategory(id);
    }
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto
  ): Transaction {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.transactionsService.delete(id);
    return { message: `Transaction ${id} deleted successfully` };
  }
}