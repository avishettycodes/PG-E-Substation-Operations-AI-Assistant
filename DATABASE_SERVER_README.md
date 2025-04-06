# PG&E Chatbot with Database-Based Mock Server

This version of the PG&E Chatbot provides answers based on the actual sample database content rather than generic mock responses.

## Features

1. **Real Database Content**: Uses the actual data from the PG&E Substation Operations Assistant database.
2. **Smart Intent Detection**: Analyzes user queries to determine the subject they're asking about.
3. **Entity Recognition**: Identifies specific assets (T-123, B-456), substations, and procedures.
4. **Formatted Responses**: Generates natural language responses based on the database content.

## Types of Information Available

The system can answer questions about:

1. **Asset Health & Diagnostics**: Health scores, diagnostic summaries, last diagnostic dates.
2. **Maintenance Work Orders**: Scheduled maintenance tasks and their details.
3. **Maintenance History**: Past maintenance activities for specific assets.
4. **Inspection Reports**: Details of asset inspections, types, and findings.
5. **Predictive Maintenance**: Risk assessments and recommended actions.
6. **Real-time Data**: Current sensor readings from substations.
7. **Safety Guidelines**: Required PPE and safety instructions for procedures.
8. **Incident Reports**: Details of failures, outages, and their causes.
9. **Inventory & Spare Parts**: Available quantities and locations of parts.

## Running the Database-Based Server

To run the server with the database content:

```bash
chmod +x run-db-server.sh
./run-db-server.sh
```

## Example Queries

Try asking about:

1. Asset health:
   - "What's the health status of Transformer T-123?"
   - "Tell me about the condition of Breaker B-456"

2. Maintenance:
   - "What maintenance is scheduled for T-123?"
   - "Show me maintenance history for B-456"

3. Inspection reports:
   - "Are there any inspection reports for T-789?"
   - "Show me the latest inspection for Breaker B-456"

4. Real-time data:
   - "What are the current sensor readings for Substation S-567?"
   - "What's the current temperature at S-567?"

5. Safety:
   - "What PPE is required for live-line maintenance?"
   - "Tell me the safety procedures for breaker racking"

6. Incidents:
   - "Were there any incidents with Transformer T-123?"
   - "What failures have been reported for T-789?"

7. Inventory:
   - "Do we have spare parts for Breaker B-456?"
   - "What's in stock for Transformer T-123?"

## Technical Details

The mock server includes:

1. **Database Content**: JSON representation of the SQL database tables.
2. **Intent Extraction**: Logic to determine what the user is asking about.
3. **Entity Recognition**: Pattern matching to identify specific assets, substations, etc.
4. **Response Generation**: Logic to format database content into natural language responses.

## Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on port 7777 (server)
kill -9 $(lsof -t -i:7777) 2>/dev/null || true

# Kill processes on port 4477 (client)
kill -9 $(lsof -t -i:4477) 2>/dev/null || true
``` 