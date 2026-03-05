import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class FindMenuItemsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  foodPartnerId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  maxCalories?: number;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailable?: boolean;
}
