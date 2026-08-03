import http from 'http';
import app from '@/app.js';
import { env } from '@/config/env.js';
import { initializeSocketEngine, io } from '@/sockets/socket.engine.js';
import { logger } from '@/utils/logger.js';

const server = http.createServer(app);
initializeSocketEngine(server);

server.listen(env.PORT, () => {
  logger.info(`🚀 ChowkSpot Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  // 1. Stop receiving new HTTP connections
  server.close(() => {
    logger.info('HTTP server closed.');
  });

  // 2. Close active Socket.io connections
  if (io) {
    io.close(() => {
      logger.info('Socket.io engine closed.');
    });
  }

  // 3. Allow outstanding async jobs to finish up to 10s
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
