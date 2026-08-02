import { Socket, Server } from 'socket.io';
import { logger } from '@/utils/logger.js';

export const registerSocketHandlers = (_io: Server, socket: Socket) => {
  const userId = socket.data.user.userId;

  // 1. Client ping/heartbeat check
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });

  // 2. Client joins a specific active booking room for direct real-time updates
  socket.on('join_booking_room', (bookingId: string) => {
    socket.join(`booking:${bookingId}`);
    logger.info(`User ${userId} joined room booking:${bookingId}`);
  });

  // 3. Client leaves booking room
  socket.on('leave_booking_room', (bookingId: string) => {
    socket.leave(`booking:${bookingId}`);
    logger.info(`User ${userId} left room booking:${bookingId}`);
  });
};
