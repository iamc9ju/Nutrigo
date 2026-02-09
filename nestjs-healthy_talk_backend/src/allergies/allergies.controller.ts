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

@Controller('patients/allergies')
@UseGuards(JwtAuthGuard)
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateAllergyDto) {
    return this.allergiesService.create(req.user!['sub'], dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.allergiesService.findAll(req.user!['sub']);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.allergiesService.findOne(req.user!['sub'], id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAllergyDto,
  ) {
    return this.allergiesService.update(req.user!['sub'], id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.allergiesService.remove(req.user!['sub'], id);
  }
}
