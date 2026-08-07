import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
        role: dto.role || 'user',
      },
    });
  }

  async findAllWithAccounts() {
    return this.prisma.user.findMany({
      include: {
        accounts: true,
      },
    });
  }

  async findOneWithAccounts(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}