import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { GenderType } from '@prisma/client';

export class CompleteProfileDto {
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;
  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;
  @IsString()
  @MaxLength(5)
  @IsOptional()
  bloodType?: string;
  @IsString({ each: true })
  @IsOptional()
  chronicDiseases?: string[];
}
