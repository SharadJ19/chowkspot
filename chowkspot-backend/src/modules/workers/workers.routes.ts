import { Router } from 'express';
import { WorkerController } from '@/modules/workers/workers.controller.js';
import { validateRequest } from '@/middlewares/validate.js';
import {
  createWorkerProfileSchema,
  updateAvailabilitySchema,
} from '@/modules/workers/workers.schema.js';
import { authenticate } from '@/middlewares/auth.middleware.js';

const router = Router();

// Public worker search route
router.get('/search', WorkerController.search);

// Authenticated worker profile routes
router.post(
  '/profile',
  authenticate,
  validateRequest(createWorkerProfileSchema),
  WorkerController.upsertProfile,
);

router.patch(
  '/availability',
  authenticate,
  validateRequest(updateAvailabilitySchema),
  WorkerController.setAvailability,
);

export default router;
