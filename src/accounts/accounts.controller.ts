import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(): Account[] {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Account | undefined {
    return this.accountsService.findOne(id);
  }
}