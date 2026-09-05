// FILE: src/modules/users/users.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/users/users.service.js';
import { userAddresses } from '@/db/schema/addresses.js';
import { db } from '@/db/index.js';
import { desc, eq } from 'drizzle-orm';
import { CONSTANTS } from '@/config/constants.js';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getProfile(req.user!.userId);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await UserService.updateProfile(req.user!.userId, req.body);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: updatedUser });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.deleteOwnAccount(req.user!.userId);
      res.clearCookie(CONSTANTS.JWT.COOKIE_NAME);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await db
        .select()
        .from(userAddresses)
        .where(eq(userAddresses.userId, req.user!.userId))
        .orderBy(desc(userAddresses.updatedAt));

      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: addresses });
    } catch (err) {
      next(err);
    }
  }
}
