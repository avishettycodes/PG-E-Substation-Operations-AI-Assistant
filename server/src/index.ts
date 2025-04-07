import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import substationRoutes from './routes/substationRoutes';
import chatRoutes from './routes/chat';
import { initDatabase } from './data/database';
import { logger } from './utils/logger';
import { AppError, errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.SERVER_PORT || 4477;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Apply rate limiting to all requests
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/substation', substationRoutes);
app.use('/api/chat', chatRoutes);

// Create a custom middleware for handling 404s
app.use((req, _res, next) => {
  const error = new AppError(`Cannot ${req.method} ${req.url}`, 404);
  next(error);
});

// Error handler middleware
app.use(errorHandler);

// Initialize the database before starting the server
initDatabase()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Handle termination signals
process.on('SIGINT', () => {
  logger.info('Shutting down server gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down server gracefully');
  process.exit(0);
}); 