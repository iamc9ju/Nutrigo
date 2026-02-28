import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@Controller('patients')
@Auth(UserRole.patient)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}
  @Post('complete-profile')
  async completeProfile(
    @Body() dto: CompleteProfileDto,
    @CurrentUser('sub') userId: string,
  ) {
    const data = await this.patientsService.completeProfile(userId, dto);
    return data;
  }
  @Get('profile')
  async getProfile(@CurrentUser('sub') userId: string) {
    const data = await this.patientsService.getProfile(userId);
    return data;
  }
}
