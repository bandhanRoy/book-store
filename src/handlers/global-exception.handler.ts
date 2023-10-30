import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponseType } from '../@types';
import { logger } from '../config/logger';
import { HTTP_STATUS_CODE_MESSAGE } from '../constants/message.constant';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error occurred';
    const request = ctx.getRequest();

    const isDevEnv =
      this.configService.get<string>('ENV') === 'DEV' ||
      this.configService.get<string>('ENV') === 'LOCAL';
    let errors = null;
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus() as HttpStatus;
      message = exception.message || exception.message?.['error'];
      errors = exception.getResponse()?.['message'] || null;
    }
    const responseBody: ErrorResponseType<typeof isDevEnv> = {
      statusCode: httpStatus,
      message:
        HTTP_STATUS_CODE_MESSAGE[httpStatus] ||
        (typeof errors !== 'object' ? errors : message),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      errors,
    };
    // return error stack in error response if debug is true in query
    isDevEnv &&
      request.query['debug'] === 'true' &&
      (responseBody['errorInfo'] = exception?.['stack']);

    logger.error(
      `${this.constructor.name}.catch Error occurred details: ${JSON.stringify({
        method: request.method,
        url: request.originalUrl,
        formattedErrResponse: responseBody,
        errStack: exception?.['stack'],
      })}`
    );
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
