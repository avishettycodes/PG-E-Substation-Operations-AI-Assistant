import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { rateLimiter } from './middleware/rateLimiter';

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
app.use(cors({
  origin: '*', // Allow all origins for now (update this for production)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '1mb' }));  // Limit payload size
app.use(rateLimiter); // Apply rate limiting to all requests

// Configure static file directories
let publicDir = path.join(__dirname, '../../../public');
let imagesDir = path.join(publicDir, '/images');
console.log('Serving images from:', imagesDir);

// Alternative path if needed
if (!fs.existsSync(publicDir)) {
  const altPublicDir = path.join(__dirname, '../../public');
  const altImagesDir = path.join(altPublicDir, '/images');
  if (fs.existsSync(altPublicDir)) {
    console.log('Using alternative public directory:', altPublicDir);
    publicDir = altPublicDir;
    imagesDir = altImagesDir;
  }
}

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

// Log the contents of the images directory
try {
  console.log('Images directory contents:', fs.readdirSync(imagesDir));
} catch (error: any) {
  console.log('Error reading images directory:', error.message);
}

// Serve static files
app.use('/images', express.static(imagesDir));

// Create a temporary public directory for the main HTML
const tempDir = path.join(__dirname, '../../temp-public');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

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

// Database content (parsed from the SQL file)
const database = {
  AssetDiagnostics: [
    {
      diagnostic_id: 1,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      health_score: 92.50,
      last_diagnostic_date: '2025-04-05 08:30:00',
      diagnostic_summary: 'No issues detected. Operating within normal parameters.',
      data_source: 'Bentley APM'
    },
    {
      diagnostic_id: 2,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      health_score: 85.00,
      last_diagnostic_date: '2025-04-04 14:20:00',
      diagnostic_summary: 'Minor degradation detected in switch contacts.',
      data_source: 'PI'
    },
    {
      diagnostic_id: 3,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      health_score: 78.30,
      last_diagnostic_date: '2025-04-03 10:15:00',
      diagnostic_summary: 'Temperature trends indicate potential overheating.',
      data_source: 'TOA'
    }
  ],
  
  MaintenanceWorkOrders: [
    {
      work_order_id: 1001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      scheduled_date: '2025-04-10',
      maintenance_details: 'Routine transformer maintenance including oil testing.',
      work_order_status: 'Scheduled'
    },
    {
      work_order_id: 1002,
      asset_id: 'S-567',
      asset_name: 'Substation S-567',
      scheduled_date: '2025-04-11',
      maintenance_details: 'Inspection and cleaning of electrical panels.',
      work_order_status: 'Scheduled'
    },
    {
      work_order_id: 1003,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      scheduled_date: '2025-04-09',
      maintenance_details: 'Replace worn contacts and perform operational tests.',
      work_order_status: 'In Progress'
    }
  ],
  
  MaintenanceHistory: [
    {
      history_id: 2001,
      work_order_id: 1001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      maintenance_date: '2025-03-15',
      maintenance_log: 'Performed oil analysis and replaced filters. No issues found.'
    },
    {
      history_id: 2002,
      work_order_id: 1003,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      maintenance_date: '2025-03-20',
      maintenance_log: 'Cleaned contacts and tested operation. Recommended follow-up inspection.'
    },
    {
      history_id: 2003,
      work_order_id: 1001,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      maintenance_date: '2025-02-10',
      maintenance_log: 'Routine maintenance completed; performance within norms.'
    }
  ],
  
  InspectionReports: [
    {
      inspection_id: 3001,
      asset_id: 'T-789',
      asset_name: 'Transformer T-789',
      inspection_type: 'Infrared',
      report_date: '2025-04-01',
      report_summary: 'Infrared imaging indicates potential hot spots around core components.',
      inspector_name: 'John Doe'
    },
    {
      inspection_id: 3002,
      asset_id: 'B-456',
      asset_name: 'Breaker B-456',
      inspection_type: 'Visual',
      report_date: '2025-03-28',
      report_summary: 'Visual inspection revealed minor wear and tear on casing.',
      inspector_name: 'Jane Smith'
    },
    {
      inspection_id: 3003,
      asset_id: 'T-123',
      asset_name: 'Transformer T-123',
      inspection_type: 'Infrared',
      report_date: '2025-03-30',
      report_summary: 'Thermal patterns are normal, no anomalies detected.',
      inspector_name: 'Alice Johnson'
    }
  ],
  
  SafetyGuidelines: [
    {
      guideline_id: 7001,
      procedure_name: 'Live-Line Maintenance',
      required_PPE: 'Insulated gloves, arc flash suit, helmet',
      safety_instructions: 'Always de-energize equipment before performing maintenance.',
      compliance_notes: 'Follow NFPA 70E guidelines.'
    },
    {
      guideline_id: 7002,
      procedure_name: 'Breaker Racking',
      required_PPE: 'Hard hat, safety glasses, gloves',
      safety_instructions: 'Ensure lockout-tagout procedures are followed before racking.',
      compliance_notes: 'Review annual safety training.'
    },
    {
      guideline_id: 7003,
      procedure_name: 'High Voltage Inspections',
      required_PPE: 'Arc flash face shield, insulated gloves, FR clothing',
      safety_instructions: 'Keep minimum approach distances. Verify equipment is de-energized.',
      compliance_notes: 'Certification required.'
    }
  ]
};

// Helper function to extract intent and entity from messages
function extractIntent(message: string): { intent: string; entity: string | null } {
  const lowerMessage = message.toLowerCase();
  
  // Extract entity (asset ID, location, etc.)
  let entity = null;
  
  // Look for asset IDs in format T-123, B-456, etc.
  const assetPattern = /([t|b|s])-(\d{3})/i;
  const assetMatch = message.match(assetPattern);
  if (assetMatch) {
    entity = assetMatch[0].toUpperCase();
  }
  
  // Look for substation IDs
  const substationPattern = /(substation\s+[a-z0-9-]+)/i;
  const substationMatch = message.match(substationPattern);
  if (substationMatch && !entity) {
    entity = substationMatch[0];
  }
  
  // Determine intent based on keywords
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return { intent: 'greeting', entity };
  } else if (lowerMessage.match(/\b(ai|artificial intelligence|capabilities|features|what can you do|functionality|chatbot)\b/)) {
    return { intent: 'ai_capabilities', entity };
  } else if (lowerMessage.match(/\b(health|status|condition|how is|state)\b/) && lowerMessage.match(/\b(transformer|breaker|asset|equipment)\b/)) {
    return { intent: 'asset_health', entity };
  } else if (lowerMessage.match(/\b(maintenance|repair|work order|schedule|planned|upcoming)\b/) && !lowerMessage.match(/\b(history|past|previous|completed)\b/)) {
    return { intent: 'scheduled_maintenance', entity };
  } else if (lowerMessage.match(/\b(history|past|previous|completed|last|recent)\b/) && lowerMessage.match(/\b(maintenance|repair|work)\b/)) {
    return { intent: 'maintenance_history', entity };
  } else if (lowerMessage.match(/\b(inspection|report|audit|finding|observation)\b/)) {
    return { intent: 'inspection_reports', entity };
  } else if (lowerMessage.match(/\b(real-time|current|live|monitoring|data)\b/)) {
    return { intent: 'real_time_data', entity };
  } else if (lowerMessage.match(/\b(safety|guideline|protocol|procedure|requirement|ppe|protection)\b/)) {
    return { intent: 'safety_guidelines', entity };
  } else if (lowerMessage.match(/\b(spare|part|inventory|replacement|available|stock)\b/)) {
    return { intent: 'spare_parts', entity };
  } else {
    return { intent: 'general_search', entity };
  }
}

// Function to get data based on intent and entity
function getDataBasedOnIntent(intent: string, entity: string | null) {
  switch (intent) {
    case 'ai_capabilities':
      return { 
        message: "I'm an AI-powered assistant for PG&E Substation Operations. I can understand natural language queries, extract key information, and provide relevant data from the substation database. My capabilities include answering questions about asset health, maintenance schedules, inspection reports, safety guidelines, and more. I can identify specific assets like transformer T-123 and provide detailed information about them. Just ask me anything related to substation operations!"
      };
      
    case 'asset_health':
      if (entity) {
        const assetDiagnostic = database.AssetDiagnostics.find(item => item.asset_id === entity);
        return assetDiagnostic || { message: `No health data found for ${entity}` };
      } else {
        return database.AssetDiagnostics;
      }
    
    case 'scheduled_maintenance':
      if (entity) {
        const maintenance = database.MaintenanceWorkOrders.filter(item => item.asset_id === entity);
        return maintenance.length > 0 ? maintenance : { message: `No scheduled maintenance found for ${entity}` };
      } else {
        return database.MaintenanceWorkOrders;
      }
    
    case 'maintenance_history':
      if (entity) {
        const history = database.MaintenanceHistory.filter(item => item.asset_id === entity);
        return history.length > 0 ? history : { message: `No maintenance history found for ${entity}` };
      } else {
        return database.MaintenanceHistory;
      }
    
    case 'inspection_reports':
      if (entity) {
        const reports = database.InspectionReports.filter(item => item.asset_id === entity);
        return reports.length > 0 ? reports : { message: `No inspection reports found for ${entity}` };
      } else {
        return database.InspectionReports;
      }
    
    case 'safety_guidelines':
      if (entity) {
        const guidelines = database.SafetyGuidelines.filter(item => 
          item.procedure_name.toLowerCase().includes(entity.toLowerCase())
        );
        return guidelines.length > 0 ? guidelines : database.SafetyGuidelines;
      } else {
        return database.SafetyGuidelines;
      }
    
    case 'greeting':
      return { message: "Hello! I'm the PG&E Substation Operations Assistant. How can I help you today?" };
    
    default:
      return { message: "I understand you're looking for information about substation operations. Can you please specify what type of information you need? For example, you can ask about asset health, maintenance schedules, or safety guidelines." };
  }
}

// Function to generate a response from the data
function generateResponseFromData(intent: string, data: any): string {
  if (data.message) {
    return data.message;
  }
  
  switch (intent) {
    case 'asset_health':
      if (Array.isArray(data)) {
        return `I found health information for ${data.length} assets: ${data.map(item => 
          `${item.asset_name} has a health score of ${item.health_score}. ${item.diagnostic_summary}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has a health score of ${data.health_score}. Last diagnostic on ${data.last_diagnostic_date.split(' ')[0]}. ${data.diagnostic_summary}`;
      }
      
    case 'scheduled_maintenance':
      if (Array.isArray(data)) {
        return `I found ${data.length} scheduled maintenance tasks: ${data.map(item => 
          `${item.asset_name} has maintenance scheduled for ${item.scheduled_date} (${item.work_order_status}). Details: ${item.maintenance_details}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} has maintenance scheduled for ${data.scheduled_date} (${data.work_order_status}). Details: ${data.maintenance_details}`;
      }
      
    case 'maintenance_history':
      if (Array.isArray(data)) {
        return `I found ${data.length} maintenance history records: ${data.map(item => 
          `${item.asset_name} had maintenance on ${item.maintenance_date}. ${item.maintenance_log}`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} had maintenance on ${data.maintenance_date}. ${data.maintenance_log}`;
      }
      
    case 'inspection_reports':
      if (Array.isArray(data)) {
        return `I found ${data.length} inspection reports: ${data.map(item => 
          `${item.asset_name} had a ${item.inspection_type} inspection on ${item.report_date}. ${item.report_summary} (Inspector: ${item.inspector_name})`
        ).join(' ')}`;
      } else {
        return `${data.asset_name} had a ${data.inspection_type} inspection on ${data.report_date}. ${data.report_summary} (Inspector: ${data.inspector_name})`;
      }
      
    case 'safety_guidelines':
      if (Array.isArray(data)) {
        return `Here are ${data.length} safety guidelines: ${data.map(item => 
          `For ${item.procedure_name}, required PPE: ${item.required_PPE}. ${item.safety_instructions} ${item.compliance_notes}`
        ).join(' ')}`;
      } else {
        return `For ${data.procedure_name}, required PPE: ${data.required_PPE}. ${data.safety_instructions} ${data.compliance_notes}`;
      }
      
    default:
      return "Based on the information in our database, here's what I can tell you: " + JSON.stringify(data);
  }
}

// Health check endpoint
app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat/query', (req: any, res: any) => {
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

// Create a simple index.html for testing
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PG&E Substation Operations Assistant</title>
  <style>
    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --pge-blue: #0072CE;
      --pge-yellow: #FEC200;
      --pge-dark-gray: #333333;
      --pge-mid-gray: #555555;
      --pge-light-gray: #F5F5F5;
      --pge-border-gray: #DDDDDD;
      --pge-white: #FFFFFF;
    }
    
    body { 
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      font-weight: 400;
      color: var(--pge-dark-gray);
      margin: 0; 
      padding: 0; 
      background-color: var(--pge-white);
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    /* Typography */
    h1 {
      font-size: 42px;
      font-weight: 700;
      color: var(--pge-white);
      margin-bottom: 0.5em;
      line-height: 1.2;
    }
    
    h2 {
      font-size: 28px;
      font-weight: 700;
      color: var(--pge-dark-gray);
      margin-bottom: 0.5em;
    }
    
    p {
      margin-bottom: 1em;
    }
    
    a {
      text-decoration: none;
    }
    
    /* Utility Navigation */
    .utility-nav {
      background-color: var(--pge-white);
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .utility-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      height: 32px;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      position: relative;
      width: 280px;
    }
    
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .search-button {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: var(--pge-mid-gray);
    }
    
    .utility-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .utility-link {
      color: var(--pge-dark-gray);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .utility-link:hover {
      color: var(--pge-blue);
    }
    
    .phone-number {
      font-weight: 600;
    }
    
    /* Main Navigation */
    .main-nav {
      background-color: var(--pge-white);
      padding: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .primary-nav {
      display: flex;
    }
    
    .nav-item {
      position: relative;
    }
    
    .nav-link {
      display: block;
      color: var(--pge-dark-gray);
      font-weight: 600;
      padding: 20px 15px;
      font-size: 16px;
      transition: color 0.2s ease;
    }
    
    .nav-link:hover {
      color: var(--pge-blue);
    }
    
    .sign-in-button {
      background-color: var(--pge-yellow);
      color: var(--pge-dark-gray);
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s ease;
    }
    
    .sign-in-button:hover {
      background-color: #e5af00;
    }
    
    .sign-in-icon {
      font-size: 18px;
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(rgba(0, 0, 30, 0.85), rgba(0, 40, 80, 0.85)),
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 100%, 20px 20px, 20px 20px;
      background-color: var(--pge-blue);
      color: var(--pge-white);
      padding: 80px 0;
      min-height: 400px;
      position: relative;
      overflow: hidden;
    }
    
    /* Visual elements representing a substation */
    .substation-visual {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      opacity: 0.25;
    }
    
    .transformer {
      position: absolute;
      width: 60px;
      height: 80px;
      border: 3px solid rgba(255, 255, 255, 0.6);
      border-radius: 5px;
      top: 30%;
      left: 20%;
      background: rgba(255, 255, 255, 0.2);
    }
    
    .transformer::before {
      content: "";
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 20px;
      border-top: 3px solid rgba(255, 255, 255, 0.6);
      border-left: 3px solid rgba(255, 255, 255, 0.6);
      border-right: 3px solid rgba(255, 255, 255, 0.6);
    }
    
    .transmission-line {
      position: absolute;
      top: 15%;
      left: 35%;
      width: 40%;
      height: 3px;
      background: rgba(255, 255, 255, 0.6);
    }
    
    .transmission-line::before,
    .transmission-line::after {
      content: "";
      position: absolute;
      width: 3px;
      height: 40px;
      background: rgba(255, 255, 255, 0.6);
    }
    
    .transmission-line::before {
      left: 0;
    }
    
    .transmission-line::after {
      right: 0;
    }
    
    .switchgear {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      top: 40%;
      left: 65%;
    }
    
    .switchgear::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -20px;
      right: -20px;
      height: 3px;
      background: rgba(255, 255, 255, 0.6);
      transform: translateY(-50%);
    }
    
    .control-house {
      position: absolute;
      width: 100px;
      height: 60px;
      border: 3px solid rgba(255, 255, 255, 0.6);
      bottom: 20%;
      right: 15%;
      background: rgba(255, 255, 255, 0.2);
    }
    
    .control-house::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: -20px;
      height: 20px;
      border-top: 3px solid rgba(255, 255, 255, 0.6);
      border-left: 3px solid rgba(255, 255, 255, 0.6);
      border-right: 3px solid rgba(255, 255, 255, 0.6);
      transform: perspective(100px) rotateX(30deg);
      transform-origin: bottom;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 580px;
    }
    
    .hero-subheading {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 30px;
      color: var(--pge-white);
    }
    
    .hero-cta {
      background-color: var(--pge-white);
      padding: 25px;
      border-radius: 8px;
      color: var(--pge-dark-gray);
      margin-top: 20px;
    }
    
    .hero-cta h2 {
      font-size: 22px;
      margin-bottom: 15px;
    }
    
    .hero-cta p {
      margin-bottom: 20px;
      color: var(--pge-mid-gray);
    }
    
    /* Chat Section */
    .content-section {
      padding: 40px 0;
      background-color: var(--pge-white);
    }
    
    .section-heading {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .chat-section {
      max-width: 800px;
      margin: 0 auto 40px;
      padding: 0 15px;
    }
    
    .chat-container {
      background-color: var(--pge-white);
      border: 1px solid var(--pge-border-gray);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      height: 400px;
      overflow-y: auto;
      margin-bottom: 16px;
    }
    
    .message {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      max-width: 80%;
      line-height: 1.4;
    }
    
    .user-message {
      background-color: var(--pge-light-gray);
      text-align: right;
      margin-left: auto;
      border-bottom-right-radius: 2px;
    }
    
    .bot-message {
      background-color: var(--pge-blue);
      color: var(--pge-white);
      margin-right: auto;
      border-bottom-left-radius: 2px;
    }
    
    .chat-input {
      display: flex;
      gap: 10px;
    }
    
    input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid var(--pge-border-gray);
      border-radius: 4px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
      color: var(--pge-dark-gray);
    }
    
    input:focus {
      outline: none;
      border-color: var(--pge-blue);
      box-shadow: 0 0 0 2px rgba(0, 114, 206, 0.2);
    }
    
    button {
      background-color: var(--pge-yellow);
      color: var(--pge-dark-gray);
      font-weight: 600;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 16px;
    }
    
    button:hover {
      background-color: #e5af00;
    }
    
    /* Quick Links */
    .quick-links {
      background-color: var(--pge-white);
      padding: 20px 0 40px;
    }
    
    .quick-links-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    
    .quick-link {
      background-color: var(--pge-white);
      border: 1px solid var(--pge-border-gray);
      border-radius: 8px;
      padding: 20px;
      width: 23%;
      min-width: 200px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .quick-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .quick-link-icon {
      font-size: 24px;
      margin-bottom: 12px;
      color: var(--pge-blue);
    }
    
    .quick-link-title {
      font-weight: 600;
      color: var(--pge-dark-gray);
    }
    
    /* Footer */
    .footer {
      background-color: var(--pge-dark-gray);
      color: var(--pge-white);
      padding: 40px 0;
    }
    
    .footer-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    
    .footer-column {
      flex: 1;
      min-width: 200px;
    }
    
    .footer-heading {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      color: var(--pge-white);
    }
    
    .footer-links {
      list-style: none;
    }
    
    .footer-link {
      display: block;
      color: #aaa;
      font-size: 14px;
      margin-bottom: 8px;
      transition: color 0.2s ease;
    }
    
    .footer-link:hover {
      color: var(--pge-white);
      text-decoration: underline;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #555;
    }
    
    .copyright {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 10px;
    }
    
    .legal-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
    }
    
    .legal-link {
      color: #aaa;
      font-size: 12px;
      transition: color 0.2s ease;
    }
    
    .legal-link:hover {
      color: var(--pge-white);
      text-decoration: underline;
    }
    
    /* Mobile Navigation Toggle */
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      color: var(--pge-dark-gray);
      cursor: pointer;
    }
    
    /* Responsive Design */
    @media (max-width: 991px) {
      .utility-links {
        gap: 12px;
      }
      
      .nav-link {
        padding: 15px 10px;
      }
      
      .quick-link {
        width: 45%;
      }
      
      .footer-grid {
        gap: 20px;
      }
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 36px;
      }
      
      .utility-container {
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .search-box {
        order: 3;
        width: 100%;
        margin-top: 10px;
      }
      
      .mobile-toggle {
        display: block;
      }
      
      .primary-nav {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: var(--pge-white);
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
      }
      
      .primary-nav.active {
        display: flex;
      }
      
      .nav-item {
        width: 100%;
        border-bottom: 1px solid #eee;
      }
      
      .nav-link {
        padding: 15px;
      }
      
      .footer-column {
        flex: 0 0 45%;
      }
    }
    
    @media (max-width: 576px) {
      h1 {
        font-size: 32px;
      }
      
      .hero {
        padding: 60px 0;
      }
      
      .hero-content {
        padding: 0 15px;
      }
      
      .quick-link {
        width: 100%;
      }
      
      .chat-input {
        flex-direction: column;
      }
      
      button {
        width: 100%;
      }
      
      .footer-column {
        flex: 0 0 100%;
      }
    }
  </style>
</head>
<body>
  <!-- Utility Navigation -->
  <div class="utility-nav">
    <div class="container utility-container">
      <a href="#" class="logo-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" style="height: 60px; width: auto; margin-top: 5px;">
          <rect width="300" height="300" fill="#0072CE"/>
          <!-- P -->
          <path d="M60 80 L60 220 L90 220 L90 160 L110 160 C125 160 140 150 140 120 C140 90 125 80 110 80 L60 80 Z" fill="white"/>
          <!-- G -->
          <path d="M150 80 C125 80 110 100 110 150 C110 200 125 220 150 220 C170 220 185 205 185 180 L160 180 L160 200 L145 200 C130 200 125 180 125 150 C125 120 130 100 145 100 C160 100 165 120 165 140 L185 140 L185 120 C185 95 170 80 150 80 Z" fill="white"/>
          <!-- & -->
          <path d="M190 120 L190 220 L240 220 L240 80 C215 80 190 100 190 120 Z" fill="#FEC200"/>
          <!-- E -->
          <path d="M250 80 L250 220 L290 220 L290 200 L270 200 L270 160 L285 160 L285 140 L270 140 L270 100 L290 100 L290 80 L250 80 Z" fill="white"/>
        </svg>
      </a>
      
      <div class="search-box">
        <input type="text" class="search-input" placeholder="Search">
        <button class="search-button">⌕</button>
      </div>
      
      <div class="utility-links">
        <a href="#" class="utility-link">Outages</a>
        <a href="#" class="utility-link phone-number">1-877-660-6789</a>
        <a href="#" class="utility-link">English</a>
      </div>
    </div>
  </div>
  
  <!-- Main Navigation -->
  <nav class="main-nav">
    <div class="container nav-container">
      <button class="mobile-toggle">☰</button>
      
      <ul class="primary-nav">
        <li class="nav-item"><a href="#" class="nav-link">Account</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Outages & Safety</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Save Energy & Money</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Business Resources</a></li>
        <li class="nav-item"><a href="#" class="nav-link">Clean Energy</a></li>
      </ul>
      
      <a href="#" class="sign-in-button">
        <span>Sign In</span>
        <span class="sign-in-icon">👤</span>
      </a>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <section class="hero">
    <!-- Add visual elements that represent a substation -->
    <div class="substation-visual">
      <div class="transformer"></div>
      <div class="transformer" style="left: 65%; top: 60%;"></div>
      <div class="transmission-line"></div>
      <div class="transmission-line" style="left: 70%; width: 30%;"></div>
      <div class="switchgear"></div>
      <div class="switchgear" style="left: 35%; top: 70%;"></div>
      <div class="control-house"></div>
    </div>
    
    <div class="container">
      <div class="hero-content">
        <h1>Substation Operations Assistant</h1>
        <p class="hero-subheading">Your AI-powered assistant for PG&E's substation operations, maintenance, and safety information.</p>
        
        <div class="hero-cta">
          <h2>Ask me about substation operations</h2>
          <p>Get instant information about assets, maintenance schedules, safety protocols, and more.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Chat Section -->
  <section class="content-section">
    <div class="container">
      <div class="section-heading">
        <h2>Substation Assistant Chat</h2>
      </div>
      
      <div class="chat-section">
        <div class="chat-container" id="chatContainer"></div>
        <div class="chat-input">
          <input type="text" id="userInput" placeholder="Type your question here..." />
          <button id="sendButton">Send</button>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3 class="footer-heading">Substation Operations</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Asset Management</a></li>
            <li><a href="#" class="footer-link">Maintenance Planning</a></li>
            <li><a href="#" class="footer-link">Inspection Reports</a></li>
            <li><a href="#" class="footer-link">System Reliability</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-heading">Safety Resources</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Safety Guidelines</a></li>
            <li><a href="#" class="footer-link">Emergency Procedures</a></li>
            <li><a href="#" class="footer-link">Training Materials</a></li>
            <li><a href="#" class="footer-link">Equipment Safety</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-heading">Documentation</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Technical Manuals</a></li>
            <li><a href="#" class="footer-link">Operating Procedures</a></li>
            <li><a href="#" class="footer-link">Industry Standards</a></li>
            <li><a href="#" class="footer-link">Historical Records</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-heading">Support</h3>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Contact Support</a></li>
            <li><a href="#" class="footer-link">Feedback</a></li>
            <li><a href="#" class="footer-link">System Status</a></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">PG&E Substation Operations Assistant &copy; 2025</p>
        <div class="legal-links">
          <a href="#" class="legal-link">Terms of Use</a>
          <a href="#" class="legal-link">Privacy Policy</a>
          <a href="#" class="legal-link">Accessibility</a>
          <a href="#" class="legal-link">Site Map</a>
        </div>
      </div>
    </div>
  </footer>
  
  <script>
    // Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('active');
      });
    }
    
    // Chat functionality
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
app.get('*', (_req: any, res: any) => {
  res.sendFile(path.join(tempDir, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`PG&E Substation Operations Assistant running on port ${PORT}`);
  console.log('All functionality consolidated to a single server');
  console.log(`Server URL: ${process.env.NODE_ENV === 'production' ? 'https://pge-substation-ai-assistant.onrender.com' : `http://localhost:${PORT}`}`);
  console.log(`Open ${process.env.NODE_ENV === 'production' ? 'https://pge-substation-ai-assistant.onrender.com' : `http://localhost:${PORT}`} in your browser to test the application`);
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