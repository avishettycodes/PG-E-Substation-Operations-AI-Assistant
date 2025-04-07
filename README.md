# PG&E Substation Operations AI Assistant

An AI-powered assistant for PG&E substation operations that provides information from a comprehensive database including asset health, maintenance schedules, inspections, and more.

## Overview

This application allows utility workers to query substation operational data using natural language, leveraging artificial intelligence to interpret questions and provide relevant responses. The AI chatbot:

* Understands natural language queries about substations
* Extracts intents and entities from user questions
* Provides accurate information from the substation database
* Responds in a conversational, human-like manner

The AI assistant includes comprehensive knowledge about:

* Asset health and diagnostics
* Maintenance schedules and history
* Safety guidelines and procedures
* Inspection reports
* Inventory and spare parts

## AI-Powered Features

* **Intent Recognition**: Automatically detects what information the user is seeking
* **Entity Extraction**: Identifies specific assets, locations, or topics in queries
* **Contextual Responses**: Delivers relevant information based on query context
* **Natural Language Processing**: Processes natural language to understand complex queries
* **Visual Representation**: Includes an interactive UI with CSS-based substation visualization

## Latest Updates

* **Detailed DGA Test Interpretation Guide**: Added comprehensive step-by-step guide for interpreting Dissolved Gas Analysis test results for transformers, including key gas identification, ratio analysis, and action recommendations.
* **Enhanced Special Case Detection**: Improved detection for PPE requirements, risk level assessment, and inventory queries with direct database lookups.
* **Enhanced Conversation Support**: Added support for casual greetings like "hi", "hey", "what's up" while maintaining focus on substation operations.
* **Improved Error Handling**: Better TypeScript support and robust error handling for server stability.
* **Port Configuration**: Updated to use port 7777 to prevent conflicts with other services.
* **Synthetic Data Generation**: Enhanced capability to generate realistic responses for assets not in the database.
* **Enhanced Intent Detection**: Improved capability to understand and respond to a wide range of query types including geofencing, predictive maintenance, and training materials.
* **Consolidated Database**: Comprehensive database structure with tables for asset diagnostics, maintenance, inspections, real-time data, and more.
* **Optimized Memory Management**: Server configuration optimized for stability and performance.

## Features

* **Conversational Interface**: Responds to simple greetings while maintaining professional focus on substation operations.
* **Asset Health Monitoring**: Get current health scores and diagnostic information for transformers, breakers, and other assets.
* **Maintenance Management**: Query scheduled maintenance, view maintenance history, and check work order status.
* **Inspection Reports**: Access inspection reports including infrared and visual inspections.
* **Predictive Maintenance**: View risk assessments and recommendations based on sensor data.
* **Real-time Data**: Access current voltage, load, and temperature readings from substations.
* **Geofencing**: Check if field workers are within authorized work areas.
* **Safety Guidelines**: Retrieve safety procedures and PPE requirements for various operations.
* **Training Materials**: Access training resources and documentation.
* **Incident Reporting**: View past incidents and potential causes.
* **Inventory Management**: Check availability of spare parts and their locations.
* **Technical Reference Guides**: Comprehensive guides for technical procedures like DGA test interpretation.

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/avishettycodes/PG-E-Substation-Operations-AI-Assistant.git
   cd PG-E-Substation-Operations-AI-Assistant
   ```

2. Install dependencies
   ```bash
   cd server
   npm install
   cd ../client
   npm install
   ```

### Running the Application

1. Start the server using the provided script:
   ```bash
   ./test-web-server.sh
   ```

2. The script will:
   - Check for existing processes on port 7777
   - Set memory limits
   - Load environment variables
   - Install dependencies if needed
   - Start the server

3. Access the API at http://localhost:7777

### API Endpoints

- **Health Check**: `GET /health`
- **Chat Query**: `POST /api/chat/query`
  ```json
  {
    "message": "What is the health status of Transformer T-123?"
  }
  ```

## Query Examples

```
# Greetings
hi
hey
what's up

# Asset Health
What is the health status of Transformer T-123?
Which assets have reported diagnostic issues in the past week?

# Maintenance
What maintenance is scheduled for Substation S-567 next week?
When is the next scheduled maintenance for Breaker B-888?

# Inspections
Show me the last infrared inspection report for Transformer T-789.

# Real-time Data
What is the temperature at Substation S-567 right now?
What is the current temperature at Substation S-999?

# Geofencing
Am I within the geofenced area for Transformer T-123?

# Safety
What are the safety guidelines for breaker racking?
What are the safety guidelines for working on high voltage circuits?
What is the required PPE for live-line maintenance?

# Technical Knowledge
How do I interpret DGA test results for transformers?
What are the key gases to look for in DGA test results?

# Inventory
Do we have spare bushings available for Transformer T-987?
What is the current stock status for replacement contacts for Breaker B-456?

# Risk Assessment
What is the current risk level for Breaker B-456?
What is the risk level for Transformer T-789?
```

## Development

### Server Structure

- `data-based-mock-server.ts`: Main server file with database implementation
- `test-web-server.ts`: Alternative server implementation with TypeScript fixes
- `test-api.sh`: Test script for verifying API functionality
- `middleware/`: Rate limiting and other middleware
- `public/`: Static files for web interface

## Deployment

The application includes a `render.yaml` file for easy deployment to Render.com. See `DEPLOYMENT.md` for detailed instructions.

## Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on port 7777
kill -9 $(lsof -ti:7777) 2>/dev/null || true
```

For more detailed troubleshooting, see `TROUBLESHOOTING.md`.

## Documentation

* `CHANGELOG.md`: Detailed list of changes by version
* `DATABASE_SERVER_README.md`: Details about the database-based server
* `DEPLOYMENT.md`: Instructions for deploying the application
* `ENV_SETUP.md`: Environment configuration setup guide
* `TROUBLESHOOTING.md`: Common issues and their solutions

## License

This project is proprietary and intended for PG&E internal use. 