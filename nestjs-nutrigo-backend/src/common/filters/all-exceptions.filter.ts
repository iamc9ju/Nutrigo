import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MyLoggerService } from 'src/my-logger/my-logger.service';
import * as crypto from 'crypto';
import type { Request } from 'express';

@Catch()
export class EnterpriseExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: MyLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request.headers['x-correlation-id'] as string) || crypto.randomUUID();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Something went wrong';
    if (Number(httpStatus) === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      message = 'Internal server error';
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message = (exceptionResponse as { message: string }).message;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const requestPath = String(
      httpAdapter.getRequestUrl(request as unknown as Record<string, unknown>),
    );
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: requestPath,
      correlationId: correlationId,
      message,
    };

    if (httpStatus >= 500) {
      this.logger.error(
        `[${correlationId}] [${EnterpriseExceptionsFilter.name}] Critical Server Error on ${httpAdapter.getRequestMethod(request)} ${httpAdapter.getRequestUrl(request)}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `[${correlationId}] Client Error ${httpStatus}: ${JSON.stringify(responseBody)}`,
        EnterpriseExceptionsFilter.name,
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
