import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'meta' in data &&
          'items' in data
        ) {
          return {
            meta: {
              code: 200,
              message: 'Successful',
              ...(typeof data.meta === 'object' ? data.meta : {}),
            },
            data: data.items,
          };
        }

        return {
          meta: {
            code: 200,
            message: 'Successful',
          },
          data,
        };
      }),
    );
  }
}
