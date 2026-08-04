import { z } from 'zod';
import { APP_CONSTANTS } from '@/config/constants';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  city: z.string().min(2, 'Please select or enter a city'),
  role: z.enum([APP_CONSTANTS.ROLES.USER, APP_CONSTANTS.ROLES.WORKER]).default('USER'),
  avatarUrl: z.url('Invalid image URL').optional().or(z.literal('')),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
