import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '@/modules/reviews/reviews.service.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.createReview(req.user!.userId, req.body);
      res.status(CONSTANTS.HTTP_STATUS.CREATED).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  static async getByWorker(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = Array.isArray(req.params.workerId)
        ? req.params.workerId[0]
        : req.params.workerId;

      if (!workerId) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.BAD_REQUEST,
          'Worker ID parameter is required',
        );
      }

      const results = await ReviewService.getWorkerReviews(workerId);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }
}
