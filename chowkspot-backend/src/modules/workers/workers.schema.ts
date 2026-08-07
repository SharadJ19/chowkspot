// FILE: src/modules/workers/workers.schema.ts
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

export const searchWorkersQuerySchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  availableOnly: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  minExperience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(0))
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .default('1'),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .default('12'),
});

export type CreateWorkerProfileInput = z.infer<typeof createWorkerProfileSchema>;
export type SearchWorkersQueryInput = z.infer<typeof searchWorkersQuerySchema>;
