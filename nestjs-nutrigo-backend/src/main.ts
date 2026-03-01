import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MyLoggerService } from './my-logger/my-logger.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { GlobalExceptionsFilter } from './common/filters/all-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(MyLoggerService));

  app.use(helmet());

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nutrigo API')
    .setDescription('The Nutrigo API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const httpAdapterHost = app.get(HttpAdapterHost);
  const myLogger = app.get(MyLoggerService);

  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapterHost, myLogger));

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
