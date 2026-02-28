import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
export enum SortBy {
  HIGHEST_RATED = 'highest_rated',
  LOWEST_FEE = 'lowest_fee',
  MOST_REVIEWS = 'most_reviews',
}

export class FindNutritionistsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsString()
  specialty?: string;
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.HIGHEST_RATED;
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
