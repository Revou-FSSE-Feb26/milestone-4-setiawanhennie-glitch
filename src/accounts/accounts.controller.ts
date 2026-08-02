import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account, CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  
  @Post()
  create(@Body() dto: CreateAccountDto): Account {
    return this.accountsService.create(dto);
  }

  @Get()
  findAll(): Account[] {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Account {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto
  ): Account {
    return this.accountsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.accountsService.delete(id);
    return { message: `Account ${id} deleted successfully` };
  }
}