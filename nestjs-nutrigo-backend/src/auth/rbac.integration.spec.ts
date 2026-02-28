// ลบของเก่าออก แล้วใช้โค้ดนี้แทนใน src/auth/rbac.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from './auth.module';
import { NutritionistsModule } from 'src/nutritionists/nutritionists.module';
import { PatientsModule } from 'src/patients/patients.module';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import type { Server } from 'http';

describe('Role-Based Access Control (RBAC) - Integration Test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        NutritionistsModule,
        PatientsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('Horizontal Privilege Escalation Prevention', () => {
    let patientAccessToken: string;

    beforeAll(async () => {
      const patientUser = await prisma.user.create({
        data: {
          email: 'rbac.patient@test.com',
          passwordHash: 'hashedpassword',
          role: 'patient',
          patient: {
            create: { firstName: 'Test', lastName: 'Patient' },
          },
        },
      });

      patientAccessToken = jwtService.sign({
        sub: patientUser.userId,
        email: patientUser.email,
        role: patientUser.role,
      });
    });

    it('should block PATIENT from accessing NUTRITIONIST schedules (POST /nutritionists/me/schedules)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/nutritionists/me/schedules')
        .set('Cookie', [`accessToken=${patientAccessToken}`])
        .send({
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '12:00',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect((response.body as { message: string }).message).toMatch(
        /Access denied/,
      );
    });

    it('should allow PATIENT to access PATIENT profiles (GET /patients/profile)', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get('/patients/profile')
        .set('Cookie', [`accessToken=${patientAccessToken}`]);

      expect(response.status).not.toBe(403);
      expect(response.status).not.toBe(401);
    });
  });
});
