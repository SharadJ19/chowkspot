import { CorsOptions } from 'cors';
import { env } from '@/config/env.js';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser calls (like Postman or server-to-server) or exact client origin
    const allowedOrigin = env.CLIENT_ORIGIN || 'http://localhost:5173';
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Access Denied: Origin ${origin} not allowed.`));
    }
  },
  credentials: true, // Required for httpOnly Refresh Token Cookie transmission
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours preflight cache
};
