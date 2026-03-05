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
import { AUTH_CONFIG } from 'src/common/constants/time.constants';
import { ErrorMessages } from 'src/common/constants/response.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
        throw new ConflictException(ErrorMessages.AUTH.EMAIL_IN_USE);
      }
      if (existingUser.phone === dto.phone) {
        this.logger.warn(
          `Registration attempt with existing phone: ${dto.phone}`,
        );
        throw new ConflictException(ErrorMessages.AUTH.PHONE_IN_USE);
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
      } else if (dto.role === 'food_partner') {
        await tx.foodPartner.create({
          data: {
            userId: user.userId,
            name: `${dto.firstName} ${dto.lastName}`.trim(),
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
      throw new UnauthorizedException(
        ErrorMessages.AUTH.INVALID_REFRESH_TOKEN_FORMAT,
      );
    }

    const token = await this.prisma.refreshToken.findUnique({
      where: { refreshTokenId: tokenId },
      include: { user: true },
    });

    if (!token) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_REFRESH_TOKEN);
    }

    if (token.revokedAt || token.expiresAt < new Date()) {
      throw new UnauthorizedException(ErrorMessages.AUTH.TOKEN_EXPIRED_REVOKED);
    }

    if (token.usedAt) {
      const GRACE_PERIOD_MS = 60 * 1000;
      if (Date.now() - token.usedAt.getTime() > GRACE_PERIOD_MS) {
        await this.prisma.refreshToken.updateMany({
          where: { family: token.family },
          data: { revokedAt: new Date() },
        });
        this.logger.warn(
          `Token reuse detected for user ${token.userId}, family ${token.family}`,
        );
        throw new UnauthorizedException(
          ErrorMessages.AUTH.TOKEN_REUSE_DETECTED,
        );
      }

      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_REFRESH_TOKEN);
    }

    const isValid = await bcrypt.compare(secret, token.secretHash);
    if (!isValid) {
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_REFRESH_TOKEN);
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
          expiresAt: new Date(
            Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN_MS,
          ),
        },
      });
    });

    const payload = {
      sub: token.user.userId,
      email: token.user.email,
      role: token.user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const [tokenId, secret] = refreshToken.split('.');
    if (!tokenId || !secret) {
      throw new UnauthorizedException(
        ErrorMessages.AUTH.INVALID_REFRESH_TOKEN_FORMAT,
      );
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
      throw new UnauthorizedException(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        patient: userBase.role === 'patient',
        nutritionist: userBase.role === 'nutritionist',
        foodPartner: userBase.role === 'food_partner',
      },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.AUTH.USER_NOT_FOUND);
    }

    return this.flattenUser(user);
  }

  private async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { patient: true, nutritionist: true, foodPartner: true },
    });

    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      this.logger.warn(`Failed login attempt: ${email}`);
      throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);
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
    return this.jwtService.sign(payload);
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
        expiresAt: new Date(
          Date.now() + AUTH_CONFIG.REFRESH_TOKEN_EXPIRES_IN_MS,
        ),
      },
    });

    return `${tokenId}.${secret}`;
  }

  private flattenUser(user: UserWithRelation) {
    const { userId, phone, email, role, is2faEnabled, createdAt } = user;

    let firstName = '';
    let lastName = '';

    const profile = user[role as keyof UserWithRelation];
    if (profile && typeof profile === 'object') {
      if ('firstName' in profile) {
        firstName = (profile as { firstName: string }).firstName;
      }
      if ('lastName' in profile) {
        lastName = (profile as { lastName: string }).lastName;
      }
      if ('name' in profile) {
        firstName = (profile as { name: string }).name;
      }
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
