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
      map((data) => {
        const { message, meta, ...rest } = data || {};

        let extractedMeta = meta;
        let responseData = rest.data ?? rest;

        if (
          responseData &&
          typeof responseData === 'object' &&
          'meta' in responseData
        ) {
          extractedMeta = responseData.meta;
          responseData = responseData.data ?? responseData;
        }

        const isEmptyObject =
          responseData &&
          typeof responseData === 'object' &&
          !Array.isArray(responseData) &&
          Object.keys(responseData).length === 0;

        return {
          success: true,
          data: isEmptyObject ? null : responseData,
          ...(extractedMeta ? { meta: extractedMeta } : {}),
          message: message || 'Operation successful',
        };
      }),
    );
  }
}
