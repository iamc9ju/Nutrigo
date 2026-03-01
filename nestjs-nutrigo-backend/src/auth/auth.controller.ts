import {
  Body,
  Controller,
  Ip,
  Post,
  Get,
  Res,
  Req,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Response, Request } from 'express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SuccessMessages } from 'src/common/constants/response.constants';
import { AUTH_CONFIG } from 'src/common/constants/time.constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ResponseMessage(SuccessMessages.AUTH.REGISTER)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ResponseMessage(SuccessMessages.AUTH.LOGIN)
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) response: Response,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const data = await this.authService.login(dto, ip, userAgent, deviceId);
    const cookieOptines = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    response.cookie('accessToken', data.accessToken, {
      ...cookieOptines,
      maxAge: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN_MS,
    });
    response.cookie('refreshToken', data.refreshToken, {
      ...cookieOptines,
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN_MS,
    });

    return data.user;
  }

  @Post('refresh')
  @ResponseMessage(SuccessMessages.AUTH.REFRESH)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-device-id') deviceId?: string,
  ) {
    const refreshToken = (request.cookies as Record<string, string>)[
      'refreshToken'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshAccessToken(
      refreshToken,
      ip,
      userAgent,
      deviceId,
    );

    const cookieOptines = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
    };

    response.cookie('accessToken', tokens.accessToken, {
      ...cookieOptines,
      maxAge: AUTH_CONFIG.ACCESS_TOKEN_EXPIRES_IN_MS,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptines,
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN_MS,
    });

    return null;
  }

  @Post('logout')
  @ResponseMessage(SuccessMessages.AUTH.LOGOUT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = (request.cookies as Record<string, string>)[
      'refreshToken'
    ];

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @ResponseMessage(SuccessMessages.AUTH.LOGOUT_ALL)
  async logoutAll(@CurrentUser('sub') userId: string) {
    return this.authService.logoutAllDevices(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ResponseMessage(SuccessMessages.AUTH.GET_ME)
  async getMe(@CurrentUser('sub') userId: string) {
    const data = await this.authService.getMe(userId);
    return data;
  }
}
