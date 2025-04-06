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
const PORT = process.env.PORT || 4477;

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

// Create a temporary public directory
const tempDir = path.join(__dirname, '../../temp-public');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Create a simple index.html for testing
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PG&E Substation Operations Assistant</title>
  <style>
    :root {
      --pge-blue: #0079C1;
      --pge-navy: #004B87;
      --pge-light-blue: #E6F3FF;
      --pge-gray: #58595B;
      --pge-light-gray: #F0F0F0;
    }
    
    body { 
      font-family: 'Arial', sans-serif; 
      margin: 0; 
      padding: 0; 
      max-width: 100%;
      background-color: #FFFFFF;
      color: var(--pge-gray);
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header { 
      background-color: var(--pge-navy);
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    header .container {
      display: flex;
      align-items: center;
    }
    
    .logo {
      font-weight: bold;
      font-size: 24px;
      margin-right: 15px;
    }
    
    h1 { 
      color: white;
      margin: 0;
      font-size: 22px;
    }
    
    .chat-container { 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      padding: 20px; 
      height: 400px; 
      overflow-y: auto; 
      margin: 20px 0;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .chat-input { 
      display: flex; 
      margin-bottom: 20px;
    }
    
    input { 
      flex: 1; 
      padding: 12px; 
      border: 1px solid #ddd; 
      border-radius: 4px; 
      margin-right: 10px;
      font-size: 16px;
    }
    
    button { 
      background: var(--pge-blue); 
      color: white; 
      border: none; 
      padding: 12px 20px; 
      border-radius: 4px; 
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: var(--pge-navy);
    }
    
    .message { 
      margin-bottom: 12px; 
      padding: 12px; 
      border-radius: 8px;
      max-width: 80%;
      line-height: 1.4;
    }
    
    .user-message { 
      background-color: var(--pge-light-blue); 
      text-align: right;
      margin-left: auto;
      border-bottom-right-radius: 2px;
    }
    
    .bot-message { 
      background-color: var(--pge-light-gray);
      margin-right: auto;
      border-bottom-left-radius: 2px;
    }
    
    footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: var(--pge-gray);
      padding: 20px 0;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">PG&E</div>
      <h1>Substation Operations Assistant</h1>
    </div>
  </header>
  
  <div class="container">
    <div class="chat-container" id="chatContainer"></div>
    <div class="chat-input">
      <input type="text" id="userInput" placeholder="Ask a question about substation operations..." />
      <button id="sendButton">Send</button>
    </div>
  </div>
  
  <footer>
    PG&E Substation Operations Assistant &copy; 2025
  </footer>
  
  <script>
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
      messageDiv.textContent = text;
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      
      addMessage(message, true);
      userInput.value = '';
      
      try {
        const response = await fetch('/api/chat/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        
        const data = await response.json();
        addMessage(data.response, false);
      } catch (error) {
        addMessage('Sorry, there was an error processing your request.', false);
        console.error('Error:', error);
      }
    }
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // Add welcome message
    addMessage('Hello! I\\'m the PG&E Substation Operations Assistant. I can provide information about substation assets, maintenance schedules, safety guidelines, and more. How can I help you today?', false);
  </script>
</body>
</html>
`;

// Write the index.html file
fs.writeFileSync(path.join(tempDir, 'index.html'), indexHtml);

// Serve static files from temp directory
app.use(express.static(tempDir));

// The "catchall" handler
app.get('*', (_req, res) => {
  res.sendFile(path.join(tempDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test web server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to test the application`);
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