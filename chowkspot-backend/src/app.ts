import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from '@/config/cors.js';
import { globalRateLimiter, authRateLimiter } from '@/middlewares/rateLimiter.js';
import { xssSanitizer } from '@/middlewares/sanitize.js';
import { globalErrorHandler } from '@/middlewares/errorHandler.js';

import authRoutes from '@/modules/auth/auth.routes.js';
import userRoutes from '@/modules/users/users.routes.js';
import workerRoutes from '@/modules/workers/workers.routes.js';
import bookingRoutes from '@/modules/bookings/bookings.routes.js';
import reviewRoutes from '@/modules/reviews/reviews.routes.js';

const app = express();

// Security Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xssSanitizer);
app.use(globalRateLimiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
