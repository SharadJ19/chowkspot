import express, { Request, Response } from 'express';
import { sql } from 'drizzle-orm';
import { db } from '@/config/database.js';
import { CONSTANTS } from '@/config/constants.js';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOptions } from '@/config/cors.js';
import { globalRateLimiter, authRateLimiter } from '@/middlewares/rateLimiter.js';
import { xssSanitizer } from '@/middlewares/sanitize.js';
import { globalErrorHandler } from '@/middlewares/errorHandler.js';

import adminRoutes from '@/modules/admin/admin.routes.js';
import authRoutes from '@/modules/auth/auth.routes.js';
import userRoutes from '@/modules/users/users.routes.js';
import workerRoutes from '@/modules/workers/workers.routes.js';
import bookingRoutes from '@/modules/bookings/bookings.routes.js';
import reviewRoutes from '@/modules/reviews/reviews.routes.js';

const app = express();

// Security & Body Parsing Middlewares
app.use(helmet());
app.use(cors(corsOptions));

// Strict Body Payload Limits (Prevents Payload Flooding & Memory Exhaustion DOS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());
app.use(xssSanitizer);
app.use(globalRateLimiter);

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Ping DB with a 1-second timeout query
    await db.execute(sql`SELECT 1`);

    res.status(CONSTANTS.HTTP_STATUS.OK).json({
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: (err as Error).message,
    });
  }
});

// API Routes
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
