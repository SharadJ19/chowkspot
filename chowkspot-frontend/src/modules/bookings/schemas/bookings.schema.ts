import { z } from 'zod';

export const createBookingSchema = z.object({
  workerId: z.uuid('Invalid worker profile ID'),
  requestedDate: z.string().min(1, 'Please select a requested date and time'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum([
    'ACCEPTED',
    'REJECTED',
    'COUNTER_PROPOSED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
  ]),
  counterDate: z.string().optional(),
});
