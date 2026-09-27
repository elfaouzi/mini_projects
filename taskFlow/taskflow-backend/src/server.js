const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await connectDB(MONGO_URI);

    const server = http.createServer(app);
    server.listen(PORT,"0.0.0.0", () => {
      console.log(`TaskFlow API running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down...`);
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
      // Force exit after 5s
      setTimeout(() => process.exit(1), 5000).unref();
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Global handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

start();
