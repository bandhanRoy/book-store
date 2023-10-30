import * as morgan from 'morgan';
import { logger } from './logger';

export const requestLogger = morgan('combined', {
  stream: { write: (message: string) => logger.log(message.trim()) },
});
