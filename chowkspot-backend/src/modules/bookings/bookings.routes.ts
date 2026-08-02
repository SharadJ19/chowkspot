import { Router } from 'express';
import { BookingController } from '@/modules/bookings/bookings.controller.js';
import { validateRequest } from '@/middlewares/validate.js';
import { createBookingSchema, updateBookingStatusSchema } from '@/modules/bookings/bookings.schema.js';
import { authenticate } from '@/middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createBookingSchema), BookingController.create);
router.get('/', BookingController.getMyBookings);
router.patch('/:id/status', validateRequest(updateBookingStatusSchema), BookingController.updateStatus);

export default router;
