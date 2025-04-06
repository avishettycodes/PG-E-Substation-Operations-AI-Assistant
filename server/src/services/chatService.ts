import { OpenAI } from 'openai';
import { logger } from '../utils/logger';

// Get API key from environment variables or use the hardcoded value as fallback
const apiKey = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY_HERE';

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey
});

// Log a warning if using the default API key
if (apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
  logger.warn('Using default OpenAI API key. Please set your actual API key in the .env file.');
}

// System prompt for the PG&E Substation Operations Assistant
const SYSTEM_PROMPT = `
You are the PG&E Substation Operations Assistant, designed to help utility workers with substation operations.
Your expertise includes:
- Asset health diagnostics
- Maintenance procedures and work orders
- Inspection reports
- Outage management
- Safety protocols
- Regulatory compliance
- Equipment specifications

Provide concise, accurate information to help utility workers efficiently manage substation operations.
`;

// Mock responses for testing when using test API key
const mockResponses = {
  greeting: "Hello! I'm the PG&E Substation Operations Assistant. How can I help you with substation operations today?",
  default: "I understand your question about PG&E substations. As the Substation Operations Assistant, I can help with asset health, maintenance procedures, inspection reports, and safety protocols. What specific information do you need?",
  maintenance: "For substation maintenance, we follow standard procedures including visual inspection, thermal scanning, oil sampling, and testing of protection devices. Would you like more information about a specific maintenance procedure?",
  safety: "Safety is our top priority. When working in substations, always use proper PPE, follow lockout/tagout procedures, maintain minimum approach distances, and never work alone. Do you need specific safety guidelines?",
  assetHealth: "Asset health monitoring includes regular diagnostics of transformers, circuit breakers, and switchgear. We track parameters like oil quality, temperature, and load levels. Which asset are you inquiring about?",
  inspections: "Inspection reports are documented in our system with details on findings, recommendations, and compliance status. You can look up recent reports by asset ID or substation location. Do you need a specific report?"
};

// Function to check if a message matches certain keywords
function matchKeywords(message: string, keywords: string[]): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

// Function to get a mock response based on message content
function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return mockResponses.greeting;
  }
  
  if (matchKeywords(message, ['maintenance', 'repair', 'work order', 'fix'])) {
    return mockResponses.maintenance;
  }
  
  if (matchKeywords(message, ['safety', 'protocol', 'accident', 'procedure', 'guidelines'])) {
    return mockResponses.safety;
  }
  
  if (matchKeywords(message, ['asset', 'health', 'condition', 'diagnostic', 'status'])) {
    return mockResponses.assetHealth;
  }
  
  if (matchKeywords(message, ['inspection', 'report', 'audit', 'check'])) {
    return mockResponses.inspections;
  }
  
  return mockResponses.default;
}

class ChatService {
  /**
   * Process a user message and generate a response
   * @param message The user's message
   * @returns A response string
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Enhanced API key validation
      if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
        logger.error('OpenAI API key is missing or using default value. Check your .env file.');
        return "OpenAI API key is not configured correctly. Please add your API key to the .env file.";
      }
      
      // Use mock responses for test API keys to avoid API charges
      if (apiKey.startsWith('sk-test')) {
        logger.info('Using mock response for test API key');
        return getMockResponse(message);
      }
      
      logger.info('Sending request to OpenAI API');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using 3.5-turbo which is more cost-effective than GPT-4
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        logger.error('Empty response received from OpenAI');
        throw new Error('No response from OpenAI');
      }

      logger.info('Received response from OpenAI API');
      return response;
    } catch (error: any) {
      // Enhanced error logging with specific error details
      if (error.name === 'AuthenticationError') {
        logger.error(`OpenAI API Authentication Error: ${error.message}`);
        return "Authentication failed with OpenAI. Please check your API key.";
      } else if (error.name === 'RateLimitError') {
        logger.error(`OpenAI API Rate Limit Error: ${error.message}`);
        return "Rate limit exceeded with OpenAI. Please try again later.";
      } else {
        logger.error('Error in OpenAI API request:', error);
        return "Sorry, there was an error processing your request. Please try again later.";
      }
    }
  }
}

export const chatService = new ChatService(); 