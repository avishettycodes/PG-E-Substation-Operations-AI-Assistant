# PG&E Substation Operations AI Assistant

An AI-powered chatbot application for PG&E substation operations that provides intelligent responses about asset health, maintenance schedules, safety guidelines, and more.

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

* **Consolidated Server**: Now runs entirely on port 4477 for simplified deployment
* **Enhanced UI**: Improved interface with responsive design and visual substation elements
* **Optimized Performance**: Memory management enhancements for better stability
* **Expanded AI Capabilities**: Added specific response handling for AI capability queries
* **Improved Font Stack**: Uses "Helvetica Neue" with proper fallbacks for consistent typography

## Getting Started

### Prerequisites

* Node.js v14 or higher
* npm v6 or higher
* 512MB or more of available memory is recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/avishettycodes/PG-E-Substation-Operations-AI-Assistant.git
cd PG-E-Substation-Operations-AI-Assistant

# Install dependencies
npm install
```

### Running the Application

The application now runs on a single consolidated server on port 4477:

```bash
cd server && node --optimize_for_size --max_old_space_size=512 --gc_interval=100 $(which npx) ts-node src/test-web-server.ts
```

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