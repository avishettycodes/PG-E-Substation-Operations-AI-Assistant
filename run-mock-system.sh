#!/bin/bash

echo "Starting mock system..."
echo "This script starts both the mock server and the React client"

# Create logs directory if it doesn't exist
mkdir -p logs

# Kill any existing processes
echo "Stopping any existing processes..."
kill -9 $(lsof -t -i:4477) 2>/dev/null || true
kill -9 $(lsof -t -i:3000) 2>/dev/null || true

# Start server in background
echo "Starting mock server..."
cd server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing server dependencies..."
  npm install
fi

echo "Starting server on port 4477..."
NODE_OPTIONS='--max-old-space-size=256' npx ts-node src/simple-mock-server.ts > ../logs/server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 2

# Check if server is running
if ! curl -s http://localhost:4477/health > /dev/null; then
  echo "Error: Server failed to start"
  echo "Check logs/server.log for details"
  exit 1
fi

echo "Mock server running successfully on port 4477"
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