import { z } from 'zod';

export const createBookingSchema = z.object({
  workerId: z.uuid('Invalid worker profile ID'),
  requestedDate: z.iso.datetime('Provide a valid ISO timestamp for requested date'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().optional(),
  addressLabel: z.string().max(30).optional(),
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
  counterDate: z.iso
    .datetime('Provide a valid ISO timestamp for counter date')
    .optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
