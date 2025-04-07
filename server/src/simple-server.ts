import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { chatService } from './services/chatService';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.SERVER_PORT || 4477;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat/query', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log(`Received chat query: ${message}`);
    
    // Use the chatService to process the message
    const response = await chatService.processMessage(message);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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