import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize Express app
const app = express();
const PORT = 7777;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock responses for different query types
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
  
  if (matchKeywords(message, ['maintenance', 'repair', 'work order', 'fix', 'transformer'])) {
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
    
    // Get mock response based on message content
    const response = getMockResponse(message);
    
    return res.json({ response });
  } catch (error) {
    console.error('Error processing chat query:', error);
    return res.status(500).json({ error: 'An error occurred while processing your message' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
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