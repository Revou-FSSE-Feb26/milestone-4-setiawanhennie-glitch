import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto): Category {
    return this.categoriesService.create(dto);
  }

  @Get()
  findAll(@Query('type') type?: string): Category[] {
    if (type) {
      return this.categoriesService.findByType(type);
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Category {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto
  ): Category {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.categoriesService.delete(id);
    return { message: `Category ${id} deleted successfully` };
  }
}