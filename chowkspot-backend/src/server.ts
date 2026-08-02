import app from './app.js';

// Native process.env loading via Node's --env-file flag
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`ChowkSpot Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle graceful shutdowns
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
