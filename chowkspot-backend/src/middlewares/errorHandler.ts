import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/ApiError.js';
import { logger } from '@/utils/logger.js';
import { CONSTANTS } from '@/config/constants.js';

interface ExpressPayloadError extends Error {
  type?: string;
  statusCode?: number;
  status?: number;
}

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle Payload Too Large errors thrown by express.json() / body-parser
  const payloadErr = err as ExpressPayloadError;
  if (
    payloadErr?.type === 'entity.too.large' ||
    payloadErr?.statusCode === CONSTANTS.HTTP_STATUS.PAYLOAD_TOO_LARGE ||
    payloadErr?.status === CONSTANTS.HTTP_STATUS.PAYLOAD_TOO_LARGE
  ) {
    return res.status(CONSTANTS.HTTP_STATUS.PAYLOAD_TOO_LARGE).json({
      success: false,
      message: 'Payload size exceeds maximum allowed limit (10kb)',
    });
  }

  logger.error(err as Error, 'Unhandled Exception Encountered');

  return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};
