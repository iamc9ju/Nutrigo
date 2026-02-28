import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError) //ถ้าเกิด Prisma error จะCatchตรงนี้เเล้ววิ่งเข้า Response
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  //ดักจับerrorเเล้วจัดการerrorก่อนresposneกลับclient
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message:
            'Data uniquely constraints conflict (e.g. Email already exists)',
          error: 'Conflict',
        });
        break;
      }
      case 'P2025': {
        // Not found
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          statusCode: status,
          message: 'Requested record does not exist',
          error: 'Not Found',
        });
        break;
      }
      default:
        // ให้มันผ่านไปเป็น 500 แต่ถูก Log ไว้
        super.catch(exception, host);
        break;
    }
  }
}
