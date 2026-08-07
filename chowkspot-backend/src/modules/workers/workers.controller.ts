// FILE: src/modules/workers/workers.controller.ts
import { Request, Response, NextFunction } from 'express';
import { WorkerService } from '@/modules/workers/workers.service.js';
import { CONSTANTS } from '@/config/constants.js';
import { searchWorkersQuerySchema } from './workers.schema.js';

export class WorkerController {
  static async upsertProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await WorkerService.createOrUpdateProfile(
        req.user!.userId,
        req.body,
      );
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static async setAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await WorkerService.toggleAvailability(
        req.user!.userId,
        req.body.isAvailable,
      );
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = searchWorkersQuerySchema.parse(req.query);
      const results = await WorkerService.searchWorkers(validatedQuery);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }
}
