import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { GenderType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteProfileDto {
  @ApiProperty({
    example: '1990-01-01',
    description: 'The date of birth of the patient',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    enum: GenderType,
    example: GenderType.male,
    description: 'The gender of the patient',
    required: false,
  })
  @IsEnum(GenderType)
  @IsOptional()
  gender?: GenderType;

  @ApiProperty({
    example: 'O+',
    description: 'The blood type of the patient',
    required: false,
  })
  @IsString()
  @MaxLength(5)
  @IsOptional()
  bloodType?: string;

  @ApiProperty({
    example: ['Diabetes', 'Hypertension'],
    description: 'List of chronic diseases',
    required: false,
    isArray: true,
  })
  @IsString({ each: true })
  @IsOptional()
  chronicDiseases?: string[];
}
