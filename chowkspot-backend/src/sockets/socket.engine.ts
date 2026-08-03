import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '@/utils/jwt.js';
import { env } from '@/config/env.js';
import { logger } from '@/utils/logger.js';
import { registerSocketHandlers } from '@/sockets/socket.handlers.js';

export let io: Server;

export const initializeSocketEngine = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (_err) {
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.userId;
    logger.info(`🔌 Socket Connected: User ${userId} (Socket ID: ${socket.id})`);

    // Each user joins a private room named "user:<userId>"
    socket.join(`user:${userId}`);

    // Register client event handlers
    registerSocketHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket Disconnected: User ${userId}`);
      socket.leave(`user:${userId}`);
    });
  });
};

export const sendRealtimeNotification = (targetUserId: string, event: string, payload: unknown) => {
  if (io) {
    io.to(`user:${targetUserId}`).emit(event, payload);
  }
};
