import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, from, Observable, throwError } from 'rxjs';

export class IgnoreErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BadRequestException) {
          return from([undefined]);
        }

        return throwError(() => err);
      }),
    );
  }
}
