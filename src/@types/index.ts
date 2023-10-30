import { HttpStatus } from '@nestjs/common';

export type SuccessResponseType<T> = {
  statusCode: HttpStatus;
  message: string;
  result: T;
  resultInfo?: {
    perPage: number;
    page: number;
  };
};

export type PaginatedSuccessResponseType<T> = SuccessResponseType<T> & {
  resultInfo: {
    perPage: number;
    page: number;
  };
};

export type ErrorResponseType<T> = Omit<SuccessResponseType<null>, 'result'> & {
  errors: unknown;
  path: string;
  timestamp: string;
} & T extends true
  ? {
      errorInfo: unknown;
    }
  : Record<string, unknown>;
