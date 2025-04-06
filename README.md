# PG&E Substation Operations Assistant

A chatbot application for PG&E substation operations that provides information about asset health, maintenance schedules, safety guidelines, and more.

## Overview

This application allows utility workers to query substation operational data using natural language. It includes a database-driven chat interface that responds with accurate information about:

- Asset health and diagnostics
- Maintenance schedules and history
- Safety guidelines and procedures
- Inspection reports
- Inventory and spare parts

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- 512MB or more of available memory is recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/pge-substation-assistant.git
cd pge-substation-assistant

# Install dependencies
npm install
```

### Running the Application

We provide two server implementations to accommodate different needs:

#### Option 1: Database-based Server (Recommended)

Uses a mock database to answer queries with specific data:

```bash
./run-db-server.sh
```

#### Option 2: Simple Server

```bash
./run-mock-system.sh
```

By default, the client runs on port 4477 and the server on port 7777.

### Memory Considerations

If you encounter memory issues, run the server and client separately:

```bash
# Terminal 1 - Run the server only
cd server && NODE_OPTIONS='--max-old-space-size=256' npx ts-node src/data-based-mock-server.ts

# Terminal 2 - Run the client only
cd client && PORT=4477 npm start
```

## Sample Queries

- "What is the health status of transformer T-123?"
- "Is there any scheduled maintenance for North Bay Area?"
- "What is the maintenance history for transformer T-123?"
- "Show me safety guidelines for breaker racking"
- "What spare parts are available for breaker B-456?"

## Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on ports
kill -9 $(lsof -ti:7777) 2>/dev/null || true
kill -9 $(lsof -ti:4477) 2>/dev/null || true
```

For more detailed troubleshooting, see `TROUBLESHOOTING.md`.

## Documentation

- `DATABASE_SERVER_README.md`: Details about the database-based server
- `TROUBLESHOOTING.md`: Common issues and their solutions

## License

This project is proprietary and intended for PG&E internal use. 