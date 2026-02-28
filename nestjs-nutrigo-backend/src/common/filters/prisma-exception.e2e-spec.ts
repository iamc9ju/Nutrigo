import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception.filter';

describe('Prisma Exception Filter (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // ใช้ AppModule จริงเพื่อทดสอบระบบทั้งหมด
    }).compile();

    app = moduleFixture.createNestApplication();

    //ผูก ValidationPipe และ Filter ให้เหมือนกับ main.ts เป๊ะๆ
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); //ล้าง Test DB
    await app.close();
  });

  describe('When triggering P2002 (Unique Constraint Failed)', () => {
    const testEmail = 'e2e_duplicate@test.com';

    beforeAll(async () => {
      //Seed ข้อมูลดักไว้ก่อน 1 ตัว
      await request(app.getHttpServer()).post('/api/auth/register').send({
        email: testEmail,
        password: 'Password123!',
        firstName: 'First',
        lastName: 'User',
        phone: '1234567890',
        role: 'patient',
      });
    });

    it('should catch the DB error and return 409 Conflict instead of 500', async () => {
      //จำลองคนสมัครซ้ำด้วยอีเมลเดิมเป๊ะๆ
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          firstName: 'Second',
          lastName: 'User',
          phone: '0987654321',
          role: 'patient',
        });

      //Assert ควบคุมคุณภาพ: ต้องไม่พังเป็น 500 แต่ต้องแปลงเป็น 409
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        error: 'Conflict',
        message: expect.stringContaining('conflict'), //เช็คว่ามีคำว่า conflict ใน message ตามแผน
      });
    });
  });
});
