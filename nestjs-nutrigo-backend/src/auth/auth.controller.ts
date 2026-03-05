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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { Response, Request } from 'express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SuccessMessages } from 'src/common/constants/response.constants';
import { AUTH_CONFIG } from 'src/common/constants/time.constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'ลงทะเบียนผู้ใช้ใหม่' })
  @ApiResponse({ status: 201, description: 'ลงทะเบียนสำเร็จ' })
  @ApiResponse({ status: 400, description: 'ข้อมูลไม่ครบ หรืออีเมลซ้ำ' })
  @ResponseMessage(SuccessMessages.AUTH.REGISTER)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน' })
  @ApiResponse({ status: 200, description: 'เข้าสู่ระบบสำเร็จ' })
  @ApiResponse({ status: 401, description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
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
  @ApiOperation({ summary: 'ขอ Token ใหม่ด้วย Refresh Token' })
  @ApiResponse({ status: 200, description: 'สร้าง Token ใหม่สำเร็จ' })
  @ApiResponse({
    status: 401,
    description: 'Refresh Token ไม่ถูกต้องหรือหมดอายุ',
  })
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
  @ApiOperation({ summary: 'ลงชื่อออก และลบ Token' })
  @ApiResponse({ status: 200, description: 'ลงชื่อออกสำเร็จ' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลงชื่อออกจากทุกอุปกรณ์' })
  @ApiResponse({ status: 200, description: 'ลงชื่อออกสำเร็จในทุกอุปกรณ์' })
  @ResponseMessage(SuccessMessages.AUTH.LOGOUT_ALL)
  async logoutAll(@CurrentUser('sub') userId: string) {
    return this.authService.logoutAllDevices(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดึงข้อมูลโปรไฟล์ของผู้ใช้งานปัจจุบัน' })
  @ApiResponse({ status: 200, description: 'คืนค่าข้อมูลผู้ใช้ปัจจุบัน' })
  @ResponseMessage(SuccessMessages.AUTH.GET_ME)
  async getMe(@CurrentUser('sub') userId: string) {
    const data = await this.authService.getMe(userId);
    return data;
  }
}
