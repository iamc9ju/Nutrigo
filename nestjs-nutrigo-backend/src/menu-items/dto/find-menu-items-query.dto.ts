import {
  IsOptional,
  IsInt,
  IsString,
  IsBoolean,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MenuItemSortField {
  NAME = 'name',
  PRICE = 'price',
  CALORIES = 'caloriesKcal',
  CREATED_AT = 'createdAt',
}

export class FindMenuItemsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by Food Partner ID' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  foodPartnerId?: number;

  @ApiPropertyOptional({ description: 'Filter by Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by maximum calories' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  maxCalories?: number;

  @ApiPropertyOptional({ description: 'Search term for name or description' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by availability' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable?: boolean;

  // Pagination
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  // Sorting
  @ApiPropertyOptional({
    enum: MenuItemSortField,
    default: MenuItemSortField.NAME,
  })
  @IsOptional()
  @IsEnum(MenuItemSortField)
  sortBy: MenuItemSortField = MenuItemSortField.NAME;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
