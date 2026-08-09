// ============================================================================
// FILE: src/modules/auth/auth.controller.ts
// ============================================================================
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/modules/auth/auth.service.js';
import { env } from '@/config/env.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

const isProd = env.NODE_ENV === 'production';

// Robust cookie options supporting cross-site Vercel <-> Render deployment
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  maxAge: CONSTANTS.JWT.REFRESH_TOKEN_COOKIE_MAX_AGE,
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.register(req.body);

      res.cookie(CONSTANTS.JWT.COOKIE_NAME, refreshToken, cookieOptions);

      res.status(CONSTANTS.HTTP_STATUS.CREATED).json({
        success: true,
        data: { user, accessToken },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req.body);

      res.cookie(CONSTANTS.JWT.COOKIE_NAME, refreshToken, cookieOptions);

      res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: { user, accessToken },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.userId) {
        await AuthService.logout(req.user.userId);
      }
      res.clearCookie(CONSTANTS.JWT.COOKIE_NAME, cookieOptions);
      res
        .status(CONSTANTS.HTTP_STATUS.OK)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenCookie = req.cookies[CONSTANTS.JWT.COOKIE_NAME];
      if (!tokenCookie) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
          'Refresh token cookie missing',
        );
      }

      const { accessToken, refreshToken } = await AuthService.refreshTokens(tokenCookie);

      res.cookie(CONSTANTS.JWT.COOKIE_NAME, refreshToken, cookieOptions);

      res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: { accessToken },
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, email } = req.body;
      const result = await AuthService.verifyEmail(token, email);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
