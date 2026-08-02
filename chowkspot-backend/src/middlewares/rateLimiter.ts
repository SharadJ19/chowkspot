import rateLimit from 'express-rate-limit';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

// Global API Limiter (100 requests per 15 minutes)
export const globalRateLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT.GLOBAL_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next, _options) => {
    next(new ApiError(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS, 'Too many requests from this IP. Please try again after 15 minutes.'));
  },
});

// Strict Auth Route Limiter for Login/Register (10 attempts per 15 minutes)
export const authRateLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT.AUTH_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next, _options) => {
    next(new ApiError(CONSTANTS.HTTP_STATUS.TOO_MANY_REQUESTS, 'Too many login/registration attempts. Please try again after 15 minutes.'));
  },
});
