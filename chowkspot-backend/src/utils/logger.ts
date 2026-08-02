import pino, { LoggerOptions } from 'pino';
import { env } from '@/config/env.js';

const pinoOptions: LoggerOptions = {
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
};

if (env.NODE_ENV === 'development') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss', // Readable local timestamp
      ignore: 'pid,hostname', // Cleans up noisy metadata
    },
  };
}

export const logger = pino(pinoOptions);
