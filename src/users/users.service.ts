import { Injectable } from '@nestjs/common';
import { User, CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'hashed_password_1',
      role: 'user',
      created_at: new Date('2026-07-01'),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'hashed_password_2',
      role: 'user',
      created_at: new Date('2026-07-01'),
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol@example.com',
      password: 'hashed_password_3',
      role: 'admin',
      created_at: new Date('2026-07-01'),
    },
  ];

  private nextId = 4;

  // CREATE
  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role || 'user',
      created_at: new Date(),
    };
    this.mockUsers.push(newUser);
    return newUser;
  }

  // READ ALL
  findAll(): User[] {
    return this.mockUsers;
  }

  // READ ONE
  findOne(id: number): User | undefined {
    return this.mockUsers.find(user => user.id === id);
  }
}