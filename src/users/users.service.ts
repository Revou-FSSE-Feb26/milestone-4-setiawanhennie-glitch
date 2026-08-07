import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private sanitize(user: any) {
    const { password, ...safe } = user;
    return safe;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.sanitize(u)); // hashes never leave the API
  }

  async findOneFor(user: JwtPayload, id: number) {
    if (user.role !== 'admin' && user.sub !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const found = await this.prisma.user.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`User with ID ${id} not found`);
    return this.sanitize(found);
  }
}