import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

@Injectable()
export class UsersService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'hashed_password_1',
      role: 'user',
      created_at: new Date(),
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: 'hashed_password_2',
      role: 'user',
      created_at: new Date(),
    },
  ];

  constructor(private configService: ConfigService) {}

  findAll(): User[] {
    return this.mockUsers;
  }

  findOne(id: number): User | undefined {
    return this.mockUsers.find(user => user.id === id);
  }
}