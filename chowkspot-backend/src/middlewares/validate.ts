import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

export const validateRequest = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return next(
          new ApiError(
            CONSTANTS.HTTP_STATUS.BAD_REQUEST,
            'Validation Failed',
            formattedErrors,
          ),
        );
      }
      next(error);
    }
  };
};
