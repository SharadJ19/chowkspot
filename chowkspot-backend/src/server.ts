import http from 'http';
import app from '@/app.js';
import { env } from '@/config/env.js';
import { initializeSocketEngine } from '@/sockets/socket.engine.js';
import { logger } from '@/utils/logger.js';

const server = http.createServer(app);

// Initialize Socket.io Server
initializeSocketEngine(server);

server.listen(env.PORT, () => {
  logger.info(`🚀 ChowkSpot Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
