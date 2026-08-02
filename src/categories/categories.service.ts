import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

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

  private nextId: number = 10;

  create(createCategoryDto: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: this.nextId++,
      name: createCategoryDto.name,
      type: createCategoryDto.type,
    };
    this.mockCategories.push(newCategory);
    return newCategory;
  }

  //READ ALL
  findAll(): Category[] {
    return this.mockCategories;
  }

  //READ ONE
  findOne(id: number): Category {
    const category = this.mockCategories.find(category => category.id === id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  //FIND BY TYPE
  findByType(type: string): Category[] {
    return this.mockCategories.filter(cat => cat.type === type);
  }

  // UPDATE
  update(id: number, dto: UpdateCategoryDto): Category {
    const categoryIndex = this.mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    this.mockCategories[categoryIndex] = {
      ...this.mockCategories[categoryIndex],
      ...dto,
    };

    return this.mockCategories[categoryIndex];
  }

  // DELETE
  delete(id: number): void {
    const categoryIndex = this.mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    this.mockCategories.splice(categoryIndex, 1);
  }
}