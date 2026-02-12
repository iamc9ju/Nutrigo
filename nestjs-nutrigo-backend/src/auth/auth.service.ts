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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      this.logger.warn(
        `Registration attempt with existing email: ${dto.email}`,
      );
      throw new ConflictException('Email already exists');
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
            userId: user.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });
      } else if (dto.role === 'nutritionist') {
        await tx.nutritionist.create({
          data: {
            userId: user.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
          },
        });
      }

      return user;
    });

    this.logger.log(`New ${dto.role} registered: ${result.id} (${dto.email})`);
    return { message: 'Registration successful', userId: result.id };
  }

  async login(dto: LoginDto, ip: string, userAgent: string, deviceId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        patient: true,
        nutritionist: true,
      },
    });

    if (!user) {
      this.logger.warn(`Failed login attempt - user not found: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Failed login attempt - invalid password: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const tokenId = crypto.randomUUID();
    const secret = crypto.randomBytes(32).toString('hex');
    const refreshToken = `${tokenId}.${secret}`;
    const secretHash = await bcrypt.hash(secret, 10);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId: user.id,
        secretHash: secretHash,
        family: crypto.randomUUID(),
        deviceId: deviceId,
        ipAddress: ip || null,
        userAgent: userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash, ...userData } = user;

    return { accessToken, refreshToken, user: userData };
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
      where: { id: tokenId },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (token.revokedAt || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired or revoked');
    }

    if (token.usedAt) {
      // Token ถูกใช้ซ้ำ = ถูกขโมย → revoke ทั้ง family
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
        where: { id: tokenId },
        data: { usedAt: new Date() },
      });

      await tx.refreshToken.create({
        data: {
          id: newTokenId,
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
      sub: token.user.id,
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
      where: { id: tokenId },
    });

    if (!token || token.revokedAt) {
      return { message: 'Logged out successfully' };
    }

    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (isValid) {
      await this.prisma.refreshToken.update({
        where: { id: tokenId },
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
}
