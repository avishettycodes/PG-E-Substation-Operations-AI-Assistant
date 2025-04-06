import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { chatService } from '../services/chatService';
import nlpService from '../services/nlpService';
import { logger } from '../utils/logger';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const router = express.Router();

// Check for OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Warning: OPENAI_API_KEY is not defined in environment variables');
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
        substation: string;
      };
    }
  }
}

/**
 * Handle chat query
 * POST /api/chat/query
 */
router.post('/query', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    logger.info(`Received chat query: ${message}`);
    
    // Process through NLP first to check if it's a substation operations query
    try {
      const nlpResults = await nlpService.processQuery(message);
      
      // If we have meaningful results from the NLP service, use those
      if (nlpResults.result && 
          (nlpResults.result.message !== 'No relevant data found for this query' ||
           (typeof nlpResults.result === 'object' && Object.keys(nlpResults.result).length > 1))) {
        
        logger.info('Query handled by NLP service', { intent: nlpResults.intent });
        
        // Generate a natural language response from the NLP results
        const response = nlpService.generateResponse(nlpResults);
        return res.json({ response });
      }
    } catch (nlpError) {
      // If NLP processing fails, log it but continue to the fallback
      logger.error('Error in NLP processing, falling back to general chat:', nlpError);
    }
    
    // Fallback to general chat service if NLP doesn't handle it
    logger.info('Falling back to general chat service');
    const response = await chatService.processMessage(message);
    
    return res.json({ response });
  } catch (error) {
    logger.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message' });
  }
});

export default router; 