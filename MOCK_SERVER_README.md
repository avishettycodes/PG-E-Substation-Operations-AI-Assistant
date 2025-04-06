# PG&E Chatbot with Mock Server

This guide will help you run the PG&E Chatbot with a mock server that doesn't require an OpenAI API key.

## Why Use the Mock Server?

1. **No API Key Required**: The mock server uses pre-defined responses instead of calling the OpenAI API.
2. **Lower Memory Usage**: The mock server is lightweight and won't crash due to memory constraints.
3. **Consistent Responses**: Get predictable answers for testing and demonstration purposes.

## Running the Mock Server and Client

### Step 1: Start the Mock Server

Open a terminal and run:

```bash
cd server
NODE_OPTIONS='--max-old-space-size=256' npx ts-node src/simple-mock-server.ts
```

You should see: `Mock server running on port 7777`

### Step 2: Start the Client

Open a new terminal window and run:

```bash
./run-client-for-mock.sh
```

This will start the React client that connects to the mock server.

## Testing the Mock Server

You can test the mock server directly using curl:

```bash
# Test health endpoint
curl http://localhost:7777/health

# Test chat endpoint with various queries
curl -X POST http://localhost:7777/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi, how are you?"}'

curl -X POST http://localhost:7777/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"message":"What are the maintenance procedures for transformers?"}'

curl -X POST http://localhost:7777/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"message":"What safety protocols should I follow?"}'
```

## Mock Response Categories

The mock server will respond with different answers based on keywords in your questions:

1. **Greetings**: Questions containing "hello", "hi", or "hey"
2. **Maintenance**: Questions about "maintenance", "repair", "work order", "fix", or "transformer"
3. **Safety**: Questions about "safety", "protocol", "accident", "procedure", or "guidelines"
4. **Asset Health**: Questions about "asset", "health", "condition", "diagnostic", or "status"
5. **Inspections**: Questions about "inspection", "report", "audit", or "check"

## Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on port 7777 (server)
kill -9 $(lsof -t -i:7777) 2>/dev/null || true

# Kill processes on port 4477 (client)
kill -9 $(lsof -t -i:4477) 2>/dev/null || true
``` 