import { z } from 'zod';

export const createWorkerProfileSchema = z.object({
  category: z.string().min(2, 'Category is required'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  experienceYears: z.number().min(0, 'Experience must be a positive number'),
  rateType: z.enum(['HOURLY', 'FIXED', 'INSPECTION_FIRST']),
  baseRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Provide a valid rate (e.g. 400 or 400.00)'),
  serviceCities: z.array(z.string()).min(1, 'Select at least one city'),
  paymentIdentifier: z.string().optional(),
});

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});
