import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseType } from 'src/@types';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponseType<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponseType<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data.message || 'Success.',
        result: data.result,
      }))
    );
  }
}
