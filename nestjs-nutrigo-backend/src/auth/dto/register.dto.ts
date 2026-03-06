import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.patient,
    description: 'Select role to see required fields',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'John' })
  @ValidateIf(
    (o) => o.role === UserRole.patient || o.role === UserRole.nutritionist,
  )
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @ValidateIf(
    (o) => o.role === UserRole.patient || o.role === UserRole.nutritionist,
  )
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'LIC-12345' })
  @ValidateIf((o) => o.role === UserRole.nutritionist)
  @IsNotEmpty()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 500 })
  @ValidateIf((o) => o.role === UserRole.nutritionist)
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  @ApiPropertyOptional({ example: 'Healthy Bowl Shop' })
  @ValidateIf((o) => o.role === UserRole.food_partner)
  @IsNotEmpty()
  @IsString()
  partnerName?: string;

  @ApiPropertyOptional({ example: '123 Sukhumvit, Bangkok' })
  @ValidateIf((o) => o.role === UserRole.food_partner)
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '0812345678' })
  @IsString()
  @IsOptional()
  phone?: string;
}
