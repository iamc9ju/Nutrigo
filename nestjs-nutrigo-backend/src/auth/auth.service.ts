import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { UserWithRelation } from './interface/user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        this.logger.warn(
          `Registration attempt with existing email: ${dto.email}`,
        );
        throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
      }
      if (existingUser.phone === dto.phone) {
        this.logger.warn(
          `Registration attempt with existing phone: ${dto.phone}`,
        );
        throw new ConflictException('phoneNumber Error');
      }
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          phone: dto.phone,
          role: dto.role,
        },
      });
      if (dto.role === 'patient') {
        await tx.patient.create({
          data: {
            userId: user.userId,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });
      } else if (dto.role === 'nutritionist') {
        await tx.nutritionist.create({
          data: {
            userId: user.userId,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });
      }

      return user;
    });

    this.logger.log(
      `New ${dto.role} registered: ${result.userId} (${dto.email})`,
    );
    return { message: 'Registration successful', userId: result.userId };
  }

  async login(dto: LoginDto, ip: string, userAgent: string, deviceId?: string) {
    const user = await this.validateUser(dto.email, dto.password);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.createRefreshToken(
      user.userId,
      ip,
      userAgent,
      deviceId,
    );

    return {
      accessToken,
      refreshToken,
      user: this.flattenUser(user),
    };
  }

  async refreshAccessToken(
    oldRefreshToken: string,
    ip?: string,
    userAgent?: string,
    deviceId?: string,
  ) {
    const [tokenId, secret] = oldRefreshToken.split('.');

    if (!tokenId || !secret) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { refreshTokenId: tokenId },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.revokedAt || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    if (token.usedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { family: token.family },
        data: { revokedAt: new Date() },
      });
      this.logger.warn(
        `Token reuse detected for user ${token.userId}, family ${token.family}`,
      );
      throw new UnauthorizedException(
        'Token reuse detected - all sessions revoked',
      );
    }

    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newTokenId = crypto.randomUUID();
    const newSecret = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = `${newTokenId}.${newSecret}`;
    const newSecretHash = await bcrypt.hash(newSecret, 10);
    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { refreshTokenId: tokenId },
        data: { usedAt: new Date() },
      });

      await tx.refreshToken.create({
        data: {
          refreshTokenId: newTokenId,
          userId: token.userId,
          secretHash: newSecretHash,
          family: token.family,
          deviceId: deviceId ?? token.deviceId,
          ipAddress: ip ?? token.ipAddress,
          userAgent: userAgent ?? token.userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    });

    const payload = {
      sub: token.user.userId,
      email: token.user.email,
      role: token.user.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const [tokenId, secret] = refreshToken.split('.');
    if (!tokenId || !secret) {
      throw new UnauthorizedException('Invalid refresh token format');
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { refreshTokenId: tokenId },
    });

    if (!token || token.revokedAt) {
      return { message: 'Logged out successfully' };
    }

    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (isValid) {
      await this.prisma.refreshToken.update({
        where: { refreshTokenId: tokenId },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out successfully' };
  }

  async logoutAllDevices(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out from all devices' };
  }

  async getMe(userId: string) {
    const userBase = await this.prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (!userBase) {
      throw new UnauthorizedException('User not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        patient: userBase.role === 'patient',
        nutritionist: userBase.role === 'nutritionist',
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.flattenUser(user);
  }

  private async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { patient: true, nutritionist: true },
    });

    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      this.logger.warn(`Failed login attempt: ${email}`);
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    return user;
  }

  private generateAccessToken(user: {
    userId: string;
    email: string;
    role: string;
  }) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private async createRefreshToken(
    userId: string,
    ip: string,
    userAgent: string,
    deviceId?: string,
  ) {
    const tokenId = crypto.randomUUID();
    const secret = crypto.randomBytes(32).toString('hex');
    const secretHash = await bcrypt.hash(secret, 10);

    await this.prisma.refreshToken.create({
      data: {
        refreshTokenId: tokenId,
        userId,
        secretHash,
        family: crypto.randomUUID(),
        deviceId,
        ipAddress: ip || null,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return `${tokenId}.${secret}`;
  }

  private flattenUser(user: UserWithRelation) {
    const {
      userId,
      phone,
      email,
      role,
      is2faEnabled,
      createdAt,
      patient,
      nutritionist,
    } = user;

    let firstName = '';
    let lastName = '';

    if (role === 'patient' && patient) {
      firstName = patient.firstName;
      lastName = patient.lastName;
    } else if (role === 'nutritionist' && nutritionist) {
      firstName = nutritionist.firstName;
      lastName = nutritionist.lastName;
    }

    return {
      userId,
      phone,
      email,
      firstName,
      lastName,
      role,
      is2faEnabled,
      createdAt,
    };
  }
}
