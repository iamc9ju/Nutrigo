import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import * as crypto from 'crypto';
import type { Request } from 'express';
import { ErrorResponseFactory } from '../utils/error-response.factory';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: MyLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const requestPath = String(
      httpAdapter.getRequestUrl(request as unknown as Record<string, unknown>),
    );

    const correlationId =
      (request.headers['x-correlation-id'] as string) || crypto.randomUUID();

    const standardErrorResponse = ErrorResponseFactory.create(exception);

    if (standardErrorResponse.statusCode >= 500) {
      this.logger.error(
        `[${correlationId}] Critical Error on ${httpAdapter.getRequestMethod(request)} ${requestPath}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${correlationId}] App Error: ${standardErrorResponse.errorCode} on ${requestPath}`,
      );
    }

    httpAdapter.reply(
      ctx.getResponse(),
      standardErrorResponse,
      standardErrorResponse.statusCode,
    );
  }
}
