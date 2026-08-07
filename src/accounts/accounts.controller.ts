import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/create-account.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto, @CurrentUser() user: JwtPayload) {
    return this.accountsService.createFor(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.accountsService.findAllFor(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.accountsService.findOneFor(user, id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.accountsService.updateFor(user, id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.accountsService.deleteFor(user, id);
  }
}