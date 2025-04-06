import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { rateLimiter } from './middleware/rateLimiter';

// Import database query functions
import { extractIntent, getDataBasedOnIntent, generateResponseFromData } from './data-based-mock-server';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Set memory usage limits
const memoryLimitMB = 256;
if (global.gc) {
  console.log(`Garbage collection enabled. Memory limit: ${memoryLimitMB}MB`);
} else {
  console.log('Garbage collection not exposed. Run with --expose-gc flag for better memory management.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));  // Limit payload size
app.use(rateLimiter); // Apply rate limiting to all requests

// Force garbage collection when memory usage is high (if available)
const memoryCheck = () => {
  if (global.gc) {
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    if (memoryUsageMB > memoryLimitMB * 0.7) {  // If using more than 70% of limit
      console.log(`Memory usage high (${memoryUsageMB}MB). Running garbage collection.`);
      global.gc();
    }
  }
};

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat/query', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Received chat query: ${message}`);
    
    // Process the message to get a database-based response
    const intentData = extractIntent(message);
    console.log(`Detected intent: ${intentData.intent}, entity: ${intentData.entity || 'none'}`);
    
    const data = getDataBasedOnIntent(intentData.intent, intentData.entity);
    const response = generateResponseFromData(intentData.intent, data);
    
    // Check memory after processing
    memoryCheck();
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message' });
  }
});

// Check if the public directory exists
const publicPath = path.join(__dirname, '../../public');
if (fs.existsSync(publicPath)) {
  // Serve static files from the React app
  app.use(express.static(publicPath, {
    maxAge: '1d'  // Cache static files for 1 day
  }));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  console.log('Warning: public directory not found at', publicPath);
  console.log('Static files will not be served.');
  
  // Add a fallback route
  app.get('/', (_req, res) => {
    res.send('PG&E Substation Operations API Server is running. Static files are not available.');
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down server gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully');
  process.exit(0);
});

// Handle memory warnings
process.on('warning', (warning) => {
  if (warning.name === 'MemoryWarning') {
    console.warn('Memory warning received:', warning.message);
    if (global.gc) {
      console.log('Running garbage collection');
      global.gc();
    }
  }
}); 