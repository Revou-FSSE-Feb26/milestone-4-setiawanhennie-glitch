import { Injectable } from '@nestjs/common';
import { Category } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  private mockCategories: Category[] = [
    { id: 1, name: 'Salary', type: 'income' },
    { id: 2, name: 'Freelance', type: 'income' },
    { id: 3, name: 'Investments', type: 'income' },
    { id: 4, name: 'Groceries', type: 'expense' },
    { id: 5, name: 'Rent', type: 'expense' },
    { id: 6, name: 'Utilities', type: 'expense' },
    { id: 7, name: 'Entertainment', type: 'expense' },
    { id: 8, name: 'Transportation', type: 'expense' },
    { id: 9, name: 'Healthcare', type: 'expense' },
  ];

  findAll(): Category[] {
    return this.mockCategories;
  }

  findOne(id: number): Category | undefined {
    return this.mockCategories.find(category => category.id === id);
  }

  findByType(type: string): Category[] {
    return this.mockCategories.filter(category => category.type === type);
  }
}