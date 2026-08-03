import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '@/utils/jwt.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS, Role } from '@/config/constants.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Authentication token missing or malformed');
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Authentication token missing');
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (_err) {
    throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired access token');
  }
};

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.FORBIDDEN, 'Access forbidden: Insufficient permissions');
    }
    next();
  };
};
