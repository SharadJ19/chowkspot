import { z } from 'zod';

export const createWorkerProfileSchema = z.object({
  category: z.string().min(2, 'Category is required (e.g. Electrician, Plumber)'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  experienceYears: z.number().min(0, 'Experience years must be positive'),
  rateType: z.enum(['HOURLY', 'FIXED', 'INSPECTION_FIRST']),
  baseRate: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Provide a valid base rate amount'),
  serviceCities: z.array(z.string()).min(1, 'Select at least one city'),
  // Flexible UPI identifier: Accepts either standard VPA or mobile number
  paymentIdentifier: z
    .string()
    .min(5, 'Provide a valid UPI ID or Phone Number')
    .refine(
      (val) => val.includes('@') || /^\d{10}$/.test(val),
      'Enter a valid UPI ID (e.g. name@upi) or 10-digit UPI mobile number',
    )
    .optional()
    .or(z.literal('')),
});
