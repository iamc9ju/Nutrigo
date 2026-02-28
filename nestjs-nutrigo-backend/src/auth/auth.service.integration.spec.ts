import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService Integration - Race Conditions & Security Boundaries', () => {
  let authService: AuthService;
  let prisma: PrismaService;

  jest.setTimeout(30000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({ secret: 'test-secret' }),
      ],
      providers: [AuthService, PrismaService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Race Conditions on Registration', () => {
    it('should securely handle concurrent registration attempts for the same email', async () => {
      const dto = {
        email: 'race_attack@hospital.com',
        password: 'StrongPassword123!',
        firstName: 'Hacker',
        lastName: 'Man',
        phone: '1234567890',
        role: 'patient' as const,
      };

      const concurrentRequests = Array.from({ length: 5 }).map(() =>
        authService.register(dto).catch((err) => err),
      );

      const results = await Promise.all(concurrentRequests);

      const successes = results.filter(
        (res) => res?.message === 'Registration successful',
      );
      const failures = results.filter(
        (res) =>
          res?.response?.statusCode === 409 ||
          res?.code === 'P2002' ||
          res?.code === 'P2028',
      );

      expect(successes).toHaveLength(1);
      expect(failures).toHaveLength(4);

      const users = await prisma.user.findMany({
        where: { email: 'race_attack@hospital.com' },
      });
      expect(users).toHaveLength(1);
    });
  });

  describe('JWT Security - Refresh Token Reuse Attack', () => {
    it('should revoke all family tokens if a refresh token is reused', async () => {
      const user = await authService.register({
        email: 'token_attack@hospital.com',
        password: 'Pass',
        firstName: 'F',
        lastName: 'L',
        phone: '0987654321',
        role: 'patient',
      });

      const loginRes = await authService.login(
        { email: 'token_attack@hospital.com', password: 'Pass' },
        '127.0.0.1',
        'Jest/1.0',
      );

      const legitimateRefreshRes = await authService.refreshAccessToken(
        loginRes.refreshToken,
      );

      expect(legitimateRefreshRes.accessToken).toBeDefined();

      await expect(
        authService.refreshAccessToken(loginRes.refreshToken),
      ).rejects.toThrow('Token reuse detected - all sessions revoked');

      await expect(
        authService.refreshAccessToken(legitimateRefreshRes.refreshToken),
      ).rejects.toThrow('Refresh token expired or revoked');
    });
  });
});
