import { Request, Response, NextFunction } from 'express';
import { BookingService } from '@/modules/bookings/bookings.service.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

export class BookingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.createBooking(req.user!.userId, req.body);
      res.status(CONSTANTS.HTTP_STATUS.CREATED).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) {
        throw new ApiError(CONSTANTS.HTTP_STATUS.BAD_REQUEST, 'Booking ID parameter is required');
      }

      const updatedBooking = await BookingService.updateBookingStatus(id, req.user!.userId, req.body);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: updatedBooking });
    } catch (err) {
      next(err);
    }
  }

  static async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await BookingService.getUserOrWorkerBookings(req.user!.userId, req.user!.role);
      res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }
}
