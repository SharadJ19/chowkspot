import { z } from 'zod';

export const createWorkerProfileSchema = z.object({
  category: z.string().min(2, 'Category is required (e.g. Electrician, Plumber)'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  experienceYears: z.number().min(0, 'Experience years must be positive'),
  rateType: z.enum(['HOURLY', 'FIXED', 'INSPECTION_FIRST']),
  baseRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Provide a valid base rate amount'),
  serviceCities: z.array(z.string()).min(1, 'Select at least one city'),
  paymentIdentifier: z.string().optional(), // UPI ID
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const searchWorkersSchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  availableOnly: z.enum(['true', 'false']).optional(),
});

export type CreateWorkerProfileInput = z.infer<typeof createWorkerProfileSchema>;
