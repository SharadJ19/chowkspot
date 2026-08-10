// FILE: src/modules/workers/workers.controller.ts
import { Request, Response, NextFunction } from 'express';
import { WorkerService } from '@/modules/workers/workers.service.js';
import { CONSTANTS } from '@/config/constants.js';
import { ApiError } from '@/utils/ApiError.js';
import { searchWorkersQuerySchema } from './workers.schema.js';

export class WorkerController {
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id) {
        throw new ApiError(CONSTANTS.HTTP_STATUS.BAD_REQUEST, 'Worker ID is required');
      }
      const worker = await WorkerService.getWorkerById(id);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: worker });
    } catch (err) {
      next(err);
    }
  }

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
