import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError.js';
import { logger } from '@/utils/logger.js';
import { CONSTANTS } from '@/config/constants.js';

export const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  logger.error(err, 'Unhandled Exception Encountered');

  return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};
