import { IsString, IsEnum } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(['income', 'expense'])
  type: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['income', 'expense'])
  @IsOptional()
  type?: string;
}

export class Category {
  id: number;
  name: string;
  type: string;
}