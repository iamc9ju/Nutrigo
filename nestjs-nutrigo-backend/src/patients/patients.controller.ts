import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { PatientsService } from './patients.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import type { Request } from 'express';

@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}
  @Post('complete-profile')
  completeProfile(@Body() dto: CompleteProfileDto, @Req() req: Request) {
    const userId = req.user!['sub'];
    return this.patientsService.completeProfile(userId, dto);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    const userId = req.user!['sub'];
    return this.patientsService.getProfile(userId);
  }
}
