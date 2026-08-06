import { Request, Response, NextFunction } from 'express';
import { AdminService } from '@/modules/admin/admin.service.js';
import { CONSTANTS } from '@/config/constants.js';
import { ApiError } from '@/utils/ApiError.js';

export class AdminController {
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = await AdminService.getAllUsers();
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: allUsers });
    } catch (err) {
      next(err);
    }
  }

  static async removeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new ApiError(CONSTANTS.HTTP_STATUS.BAD_REQUEST, 'User ID is required');
      }
      const result = await AdminService.deleteUser(id);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
