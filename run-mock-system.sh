#!/bin/bash

# Check for command line arguments
if [ "$1" == "--database" ] || [ "$1" == "-d" ]; then
  SERVER_SCRIPT="src/data-based-mock-server.ts"
  TITLE="PG&E Chatbot with Database-Based Server"
  DESCRIPTION="This version uses actual database content to answer questions."
else
  SERVER_SCRIPT="src/simple-mock-server.ts"
  TITLE="PG&E Chatbot with Simple Mock Server"
  DESCRIPTION="This version uses generic mock responses to answer questions."
fi

echo "$TITLE"
echo "======================================"
echo "$DESCRIPTION"
echo ""

# Kill any existing processes
echo "Stopping any existing processes..."
kill -9 $(lsof -t -i:7777) 2>/dev/null || true
kill -9 $(lsof -t -i:4477) 2>/dev/null || true

# Start the mock server
echo "Starting mock server..."
cd server && NODE_OPTIONS='--max-old-space-size=256' npx ts-node $SERVER_SCRIPT &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 2

# Check if server is running
if ! curl -s http://localhost:7777/health > /dev/null; then
  echo "Error: Server failed to start"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo "Mock server running successfully on port 7777"
echo "--------------------------------------------"

# Start the client
echo "Starting client..."
cd ../client && PORT=4477 npm start &
CLIENT_PID=$!

echo "Client starting on port 4477"
echo "----------------------------"

echo "To access the chatbot, open: http://localhost:4477"
echo "To stop both server and client, press Ctrl+C"

# Handle exit
function cleanup {
  echo "Shutting down..."
  kill $SERVER_PID 2>/dev/null
  kill $CLIENT_PID 2>/dev/null
  echo "Shutdown complete"
}

trap cleanup EXIT

# Keep script running
wait 