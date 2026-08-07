import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/create-transaction.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() user: JwtPayload) {
    return this.transactionsService.createFor(user, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('type') type?: string,
    @Query('account_id') accountId?: string,
    @Query('include') include?: string,
  ) {
    if (accountId) {
      return this.transactionsService.findByAccountIdFor(user, Number(accountId));
    }
    if (type && include === 'category') {
      return this.transactionsService.findByTypeWithCategoryFor(user, type);
    }
    if (type) return this.transactionsService.findByTypeFor(user, type);
    if (include === 'category') {
      return this.transactionsService.findAllWithCategoryFor(user);
    }
    return this.transactionsService.findAllFor(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
    @Query('include') include?: string,
  ) {
    return this.transactionsService.findOneFor(user, id, include === 'category');
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.transactionsService.updateFor(user, id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.transactionsService.deleteFor(user, id);
  }
}