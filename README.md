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

* **Enhanced Intent Detection**: Improved capability to understand and respond to a wide range of query types including geofencing, predictive maintenance, and training materials.
* **Consolidated Database**: Comprehensive database structure with tables for asset diagnostics, maintenance, inspections, real-time data, and more.
* **Optimized Memory Management**: Server configuration optimized for stability and performance.
* **Improved Startup Script**: Updated startup script for easier deployment and maintenance.

## Features

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

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pge-substation-assistant.git
   cd pge-substation-assistant
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
What is the health status of Transformer T-123?
Which assets have reported diagnostic issues in the past week?
What maintenance is scheduled for Substation S-567 next week?
Show me the last infrared inspection report for Transformer T-789.
What is the temperature at Substation S-567 right now?
Am I within the geofenced area for Transformer T-123?
What are the safety guidelines for breaker racking?
How do I interpret DGA test results for transformers?
Do we have spare bushings available for Transformer T-987?
```

## Development

### Server Structure

- `data-based-mock-server.ts`: Main server file with database implementation
- `middleware/`: Rate limiting and other middleware
- `public/`: Static files for web interface

## Deployment

The application includes a `render.yaml` file for easy deployment to Render.com.

## Sample Queries for the AI Chatbot

* "What are your AI capabilities?"
* "What is the health status of transformer T-123?"
* "Is there any scheduled maintenance for North Bay Area?"
* "What is the maintenance history for transformer T-123?"
* "Show me safety guidelines for breaker racking"
* "What spare parts are available for breaker B-456?"

## Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on port 4477
kill -9 $(lsof -ti:4477) 2>/dev/null || true
```

For more detailed troubleshooting, see `TROUBLESHOOTING.md`.

## Documentation

* `DATABASE_SERVER_README.md`: Details about the database-based server
* `TROUBLESHOOTING.md`: Common issues and their solutions

## License

This project is proprietary and intended for PG&E internal use. 