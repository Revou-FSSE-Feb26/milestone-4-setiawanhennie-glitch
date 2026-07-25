import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query('type') type?: string): Category[] {
    if (type) {
      return this.categoriesService.findByType(type);
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Category | undefined {
    return this.categoriesService.findOne(id);
  }
}