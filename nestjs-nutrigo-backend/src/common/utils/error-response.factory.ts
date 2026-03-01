import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { StandardErrorResponse } from '../interfaces/error.interface';
import { ErrorCodes, ErrorMessages } from '../constants/response.constants';

export class ErrorResponseFactory {
  static create(exception: unknown): StandardErrorResponse {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = ErrorMessages.INTERNAL_SERVER_ERROR;
    let errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse() as Record<string, unknown>;

      message = (response.message as string | string[]) || exception.message;

      if (response.errorCode) {
        errorCode = response.errorCode as string;
      } else if (statusCode === HttpStatus.UNAUTHORIZED) {
        errorCode = ErrorCodes.AUTH_UNAUTHORIZED;
      } else {
        errorCode =
          (response.error as string)?.toUpperCase().replace(/\s+/g, '_') ||
          `HTTP_ERROR_${statusCode}`;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const parsed = this.parsePrismaError(exception);
      statusCode = parsed.statusCode;
      message = parsed.message;
      errorCode = parsed.errorCode;
    } else if (exception instanceof Error) {
      message = ErrorMessages.PROCESSING_ERROR;
    }

    return {
      success: false,
      message,
      errorCode,
      statusCode,
    };
  }

  private static parsePrismaError(error: Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: ErrorMessages.PRISMA.UNIQUE_CONSTRAINT,
          errorCode: ErrorCodes.PRISMA_UNIQUE_CONSTRAINT,
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: ErrorMessages.PRISMA.RECORD_NOT_FOUND,
          errorCode: ErrorCodes.PRISMA_RECORD_NOT_FOUND,
        };
      default:
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorMessages.PRISMA.OPERATION_FAILED,
          errorCode: `PRISMA_ERROR_${error.code}`,
        };
    }
  }
}
