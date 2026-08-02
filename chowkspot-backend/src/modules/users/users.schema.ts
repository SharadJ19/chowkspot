import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  city: z.string().min(2, 'City name is required').optional(),
  avatarUrl: z.url('Invalid Cloudinary URL string').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
