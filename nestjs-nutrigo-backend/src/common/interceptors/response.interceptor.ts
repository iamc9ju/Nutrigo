import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((rawData: unknown) => {
        const data = (rawData || {}) as ResponseWithMeta;
        const { message, meta, ...rest } = data;

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

        return {
          success: true,
          data: (isEmptyObject ? null : responseData) as T,
          ...(extractedMeta ? { meta: extractedMeta } : {}),
          message: message || 'Operation successful',
        };
      }),
    );
  }
}
