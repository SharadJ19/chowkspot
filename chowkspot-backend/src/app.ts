import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// --- Standard Middlewares ---
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true, // Required for httpOnly Refresh Token Cookies
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
