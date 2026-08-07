import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Query('include') include?: string) {
    if (include === 'accounts') {
      return this.usersService.findAllWithAccounts();
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include') include?: string,
  ) {
    if (include === 'accounts') {
      return this.usersService.findOneWithAccounts(id);
    }
    return this.usersService.findOne(id);
  }
}