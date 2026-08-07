import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}