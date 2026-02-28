import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

describe('ThrottlerGuard Rate Limiting (e2e)', () => {
  let app: INestApplication;

  const MAX_CALLS = 3;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(ThrottlerModule)
      .useModule(
        ThrottlerModule.forRoot([
          {
            ttl: 5000,
            limit: MAX_CALLS,
          },
        ]),
      )
      .overrideProvider(APP_GUARD)
      .useClass(ThrottlerGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('DDoS Protection on /auth/login', () => {
    it(`should block the request with 429 when exceeding ${MAX_CALLS} attempts`, async () => {
      const requests = Array.from({ length: MAX_CALLS + 1 }).map(() =>
        request(app.getHttpServer()).post('/api/auth/login').send({
          email: 'ddos@test.com',
          password: 'incorrect',
        }),
      );
      const responses = await Promise.all(requests);

      const statusCodes = responses.map((res) => res.status);

      const allowedRequests = statusCodes.filter((status) => status !== 429);
      expect(allowedRequests.length).toBe(MAX_CALLS);

      const blockedRequests = statusCodes.filter((status) => status === 429);
      expect(blockedRequests.length).toBe(1);

      const finalTry = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'ddos@test.com', password: 'incorrect' });
      expect(finalTry.status).toBe(429);
    });
  });
});
