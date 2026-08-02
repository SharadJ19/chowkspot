import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/users/users.service.js';
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
}
