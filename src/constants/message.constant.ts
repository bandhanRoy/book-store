import { HttpStatus } from '@nestjs/common';

export const HTTP_STATUS_CODE_MESSAGE = {
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error Occurred.',
  [HttpStatus.BAD_REQUEST]: 'Bad Request.',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized.',
  [HttpStatus.CONFLICT]: 'Conflict Occurred.',
  [HttpStatus.FORBIDDEN]: 'Access Denied.',
  [HttpStatus.NOT_FOUND]: 'Not Found.',
} as const;
