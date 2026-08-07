import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryType } from '@prisma/client'; 
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        type: dto.type,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findByType(type: string) {
    return this.prisma.category.findMany({
      where: { type: type as CategoryType },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.prisma.category.delete({
      where: { id },
    });
  }
}