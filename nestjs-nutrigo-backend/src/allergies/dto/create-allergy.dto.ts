import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AllergySeverity } from '@prisma/client';

export class CreateAllergyDto {
  @IsString()
  @MaxLength(100)
  ingredientName: string;
  @IsEnum(AllergySeverity)
  @IsOptional()
  severity?: AllergySeverity;
  @IsOptional()
  note?: string;
}
