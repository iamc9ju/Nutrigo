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
  gender?: GenderType; // 'male' | 'female' | 'other'
  @IsString()
  @MaxLength(5)
  @IsOptional()
  bloodType?: string; // เช่น 'A', 'B', 'O', 'AB', 'A+', 'B-', ฯลฯ
  @IsString({ each: true })
  @IsOptional()
  chronicDiseases?: string[]; // โรคประจำตัว เช่น ['Diabetes', 'Hypertension']
}
