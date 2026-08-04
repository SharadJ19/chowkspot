import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.uuid('Invalid booking ID format'),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(500, 'Comment cannot exceed 500 characters').optional(),
});
