import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SortBy {
  HIGHEST_RATED = 'highest_rated',
  LOWEST_FEE = 'lowest_fee',
  MOST_REVIEWS = 'most_reviews',
}

export class FindNutritionistsQueryDto {
  @ApiPropertyOptional({
    description: 'คำค้นหาชื่อนักโภชนาการ',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ความเชี่ยวชาญ',
    example: 'Weight Loss',
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    enum: SortBy,
    description: 'การเรียงลำดับผลลัพธ์',
    example: SortBy.HIGHEST_RATED,
    default: SortBy.HIGHEST_RATED,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.HIGHEST_RATED;

  @ApiPropertyOptional({
    description: 'ค่าบริการสูงสุดที่ยอมรับได้',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxFee?: number;

  @ApiPropertyOptional({
    description: 'คะแนนรีวิวขั้นต่ำ',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'หน้าที่ต้องการแสดง',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'จำนวนรายการต่อหน้า',
    example: 12,
    default: 12,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 12;
}
