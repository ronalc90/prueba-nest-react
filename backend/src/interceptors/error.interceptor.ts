import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const status = error.getStatus();
          const response = error.getResponse();

          // Formatear el error
          const formattedError = {
            statusCode: status,
            message:
              typeof response === 'string'
                ? response
                : (response as any).message || error.message,
          };

          return throwError(() => new HttpException(formattedError, status));
        }

        // Error no HTTP
        const formattedError = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor',
        };

        return throwError(
          () =>
            new HttpException(formattedError, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
  }
}
