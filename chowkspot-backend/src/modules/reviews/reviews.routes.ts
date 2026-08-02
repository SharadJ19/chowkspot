import { Router } from 'express';
import { ReviewController } from '@/modules/reviews/reviews.controller.js';
import { validateRequest } from '@/middlewares/validate.js';
import { createReviewSchema } from '@/modules/reviews/reviews.schema.js';
import { authenticate } from '@/middlewares/auth.middleware.js';

const router = Router();

// Public route to view worker reviews
router.get('/worker/:workerId', ReviewController.getByWorker);

// Authenticated route to post a review
router.post('/', authenticate, validateRequest(createReviewSchema), ReviewController.create);

export default router;
