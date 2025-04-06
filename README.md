# PG&E Substation Operations Assistant

A chatbot application designed to assist utility workers with substation operations, maintenance, safety procedures, and technical support.

## Server Options

The system includes two different server implementations:

### 1. Simple Mock Server (Default)

This server provides generic, keyword-based responses. It doesn't require OpenAI API keys but answers are not based on actual database content.

To run:
```bash
./run-mock-system.sh
```

### 2. Database-Based Mock Server

This server provides responses directly from the sample PG&E substation database. It gives more accurate and detailed answers based on actual database content.

To run:
```bash
./run-mock-system.sh --database
```
or
```bash
./run-mock-system.sh -d
```

## Features

- Natural language processing for substation operations queries
- Asset health and diagnostics information
- Maintenance and work order assistance
- Inspection report lookup and submission
- Real-time data query from PI & SCADA
- Compliance & safety guidance
- Training & knowledge assistance
- Responsive web interface matching PG&E's official style

## Technology Stack

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite
- **AI**: OpenAI GPT-4 for general queries, custom NLP for structured data queries

## Project Structure

```
├── client/                # React frontend
│   ├── src/               
│   │   ├── components/    # UI components
│   │   ├── assets/        # Images, fonts, etc.
│   │   └── ...
├── server/                # Express backend
│   ├── src/
│   │   ├── data/          # Database and mock data
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── index.ts       # Server entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/pge-substation-operations.git
   cd pge-substation-operations
   ```

2. Install dependencies:
   ```
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PORT=7777
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4477` to use the application.

## Database

The application uses SQLite to store substation operations data. The database schema includes:

- Asset diagnostics
- Maintenance work orders
- Inspection reports
- Real-time data
- Safety guidelines
- Training materials
- Inventory information

## API Endpoints

### Chat API
- `POST /api/chat/query`: Submit a chat message and get a response

### Substation Operations API
- `GET /api/substation/asset/:assetId/health`: Get asset health data
- `GET /api/substation/maintenance/scheduled/:location`: Get scheduled maintenance
- `GET /api/substation/asset/:assetId/maintenance-history`: Get maintenance history
- `GET /api/substation/asset/:assetId/inspection-reports`: Get inspection reports
- `GET /api/substation/:substationId/real-time-data`: Get real-time data
- `GET /api/substation/safety/:procedure`: Get safety guidelines
- `GET /api/substation/asset/:assetId/spare-parts`: Get spare parts info
- `GET /api/substation/search?keyword=...`: Search all substation data

## Example Questions

Try asking:

- "What's the health status of Transformer T-123?"
- "When is the next scheduled maintenance for Breaker B-456?"
- "Show me the maintenance history for T-123"
- "What safety equipment is needed for live-line maintenance?"
- "What are the current sensor readings at Substation S-567?"
- "Were there any recent incidents with transformers?"
- "Do we have spare parts for Breaker B-456?"

## Troubleshooting

If you encounter port conflicts:
```bash
# Kill processes on port 7777 (server)
kill -9 $(lsof -t -i:7777) 2>/dev/null || true

# Kill processes on port 4477 (client)
kill -9 $(lsof -t -i:4477) 2>/dev/null || true
```

## Documentation

For more details, see:
- [MOCK_SERVER_README.md](MOCK_SERVER_README.md) - Details on the simple mock server
- [DATABASE_SERVER_README.md](DATABASE_SERVER_README.md) - Details on the database-based server 