import { Body, Controller, Ip, Post, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-device-id') deviceId?: string,
  ) {
    return this.authService.login(dto, ip, userAgent, deviceId);
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-device-id') deviceId?: string,
  ) {
    return this.authService.refreshAccessToken(
      dto.refreshToken,
      ip,
      userAgent,
      deviceId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@CurrentUser('sub') userId: string) {
    return this.authService.logoutAllDevices(userId);
  }
}
