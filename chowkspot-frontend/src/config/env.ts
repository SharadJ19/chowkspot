// Type-safe import.meta.env validation

import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('ChowkSpot'),
  VITE_APP_URL: z.url('VITE_APP_URL must be a valid URL'),
  VITE_API_BASE_URL: z.url('VITE_API_BASE_URL must be a valid backend REST URL'),
  VITE_SOCKET_URL: z.url('VITE_SOCKET_URL must be a valid WebSocket server URL'),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary Cloud Name is required'),
  VITE_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .min(1, 'Cloudinary Upload Preset is required'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error('❌ Invalid Frontend Environment Variables:');
    console.error(z.treeifyError(result.error));
    throw new Error(
      'Invalid environment variable configuration. Check developer console.',
    );
  }

  return result.data;
};

export const env = parseEnv();
