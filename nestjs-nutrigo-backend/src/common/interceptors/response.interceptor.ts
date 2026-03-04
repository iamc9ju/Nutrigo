import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_METADATA } from '../constants/response.constants';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface ResponseWithMeta {
  message?: string;
  meta?: Record<string, unknown>;
  data?: unknown;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((rawData: unknown) => {
        const decoratorMessage = this.reflector.getAllAndOverride<
          string | undefined
        >(RESPONSE_MESSAGE_METADATA, [
          context.getHandler(),
          context.getClass(),
        ]);

        // If rawData is an array, preserve it as-is (e.g. availability slots)
        if (Array.isArray(rawData)) {
          return {
            success: true,
            data: rawData as unknown as T,
            message: decoratorMessage || 'Operation successful',
          };
        }

        const data = (rawData || {}) as ResponseWithMeta;
        const { message: explicitMessage, meta, ...rest } = data;

        let extractedMeta: Record<string, unknown> | undefined = meta;
        let responseData: unknown = rest.data ?? rest;

        if (
          responseData &&
          typeof responseData === 'object' &&
          'meta' in responseData
        ) {
          const nested = responseData as ResponseWithMeta;
          extractedMeta = nested.meta;
          responseData = nested.data ?? responseData;
        }

        const isEmptyObject =
          responseData &&
          typeof responseData === 'object' &&
          !Array.isArray(responseData) &&
          Object.keys(responseData as Record<string, unknown>).length === 0;

        const finalMessage =
          decoratorMessage || explicitMessage || 'Operation successful';

        return {
          success: true,
          data: (isEmptyObject ? null : responseData) as T,
          ...(extractedMeta ? { meta: extractedMeta } : {}),
          message: finalMessage,
        };
      }),
    );
  }
}
