# PG&E Substation Operations Assistant

A chatbot application for PG&E substation operations that provides information about asset health, maintenance schedules, safety guidelines, and more.

## Overview

This application allows utility workers and engineers to interact with substation operational data through natural language queries. It includes:

- A client application built with React
- A server application built with Node.js and Express
- A database-based chat API that responds to queries with relevant information
- Support for various types of queries including asset health, maintenance schedules, safety procedures, and more

## Features

- **Interactive Chat Interface**: Ask questions in natural language about PG&E substation operations
- **Asset Health Monitoring**: Get information about the health status of transformers, breakers, and other assets
- **Maintenance Tracking**: View scheduled maintenance and maintenance history
- **Inspection Reports**: Access inspection report data
- **Safety Guidelines**: Retrieve safety procedures for various substation operations
- **Inventory Management**: Check the availability of spare parts
- **Natural Language Processing**: The system understands and responds to various phrasings of similar questions

## System Requirements

- Node.js v14 or higher
- npm v6 or higher
- 512MB or more of available memory is recommended

## Getting Started

### Installation

1. Clone this repository
2. Install dependencies for both client and server:

```bash
npm install
```

### Configuration

1. Create a `.env` file in the root directory with the following variables:

```
# OpenAI API Configuration
OPENAI_API_KEY=your_api_key_here

# Server Configuration
SERVER_PORT=7777
LOG_LEVEL=info

# Client Configuration
PORT=4477
REACT_APP_API_URL=http://localhost:7777/api
```

### Running the Application

#### Option 1: Run with the default server (OpenAI-based responses)

```bash
npm start
```

#### Option 2: Run with the database-based server (mock data responses)

```bash
./run-mock-system.sh --database
```

### Different Server Options

This project comes with different server implementations:

1. **Standard Server** (`src/index.ts`): Uses OpenAI API to generate responses
2. **Simple Mock Server** (`src/simple-mock-server.ts`): Returns hardcoded responses
3. **Database-based Mock Server** (`src/data-based-mock-server.ts`): Returns data from a sample database

See `MOCK_SERVER_README.md` and `DATABASE_SERVER_README.md` for more details.

## Documentation

- `ENV_SETUP.md`: Details about environment variable setup
- `TROUBLESHOOTING.md`: Common issues and their solutions
- `MOCK_SERVER_README.md`: Information about the mock server
- `DATABASE_SERVER_README.md`: Details about the database-based server
- `GITHUB_INSTRUCTIONS.md`: How to push this code to GitHub

## Sample Queries

- "What is the health status of transformer T-123?"
- "Is there any scheduled maintenance for North Bay Area?"
- "What is the maintenance history for transformer T-123?"
- "Show me safety guidelines for breaker racking"
- "What spare parts are available for breaker B-456?"

## Troubleshooting

If you encounter any issues with memory, ports, or other configuration, please see `TROUBLESHOOTING.md` for detailed solutions.

## License

This project is proprietary and intended for PG&E internal use. 