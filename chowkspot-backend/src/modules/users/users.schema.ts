import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  city: z.string().min(2, 'City name is required').optional(),
  avatarUrl: z.url('Invalid Cloudinary URL string').optional().or(z.literal('')),
  // Worker profile fields
  category: z.string().min(2, 'Category is required').optional(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  experienceYears: z.number().min(0, 'Experience must be positive').optional(),
  rateType: z.enum(['HOURLY', 'FIXED', 'INSPECTION_FIRST']).optional(),
  baseRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Provide a valid rate')
    .optional(),
  serviceCities: z.array(z.string()).min(1, 'Select at least one city').optional(),
  paymentIdentifier: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
