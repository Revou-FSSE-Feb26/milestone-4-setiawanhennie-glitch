import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('account_id') accountId?: string,
  ): Transaction[] {
    if (accountId) {
      return this.transactionsService.findByAccountId(Number(accountId));
    }
    if (type) {
      return this.transactionsService.findByType(type);
    }
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Transaction | undefined {
    return this.transactionsService.findOne(id);
  }
}