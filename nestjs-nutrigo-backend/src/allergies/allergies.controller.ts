import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import type { Request } from 'express';
import { UpdateAllergyDto } from './dto/update-allergy.dto';
import { AllergiesService } from './allergies.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@Controller('patients/allergies')
@Auth(UserRole.patient)
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAllergyDto,
  ) {
    const data = await this.allergiesService.create(userId, dto);
    return data;
  }

  @Get()
  async findAll(@CurrentUser('sub') userId: string) {
    const data = await this.allergiesService.findAll(userId);
    return data;
  }

  @Get(':id')
  async findOne(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.allergiesService.findOne(userId, id);
    return data;
  }

  @Patch(':id')
  async update(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAllergyDto,
  ) {
    const data = await this.allergiesService.update(userId, id, dto);
    return data;
  }

  @Delete(':id')
  async remove(
    @CurrentUser('sub') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const data = await this.allergiesService.remove(userId, id);
    return data;
  }
}
