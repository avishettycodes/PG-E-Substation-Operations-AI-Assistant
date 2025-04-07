#!/bin/bash

echo "Starting PG&E Chatbot with Database-Based Server"
echo "==============================================="

# Kill any existing processes
echo "Stopping any existing processes..."
kill -9 $(lsof -t -i:7777) 2>/dev/null || true
kill -9 $(lsof -t -i:4477) 2>/dev/null || true

# Start the mock server
echo "Starting database-based mock server..."

# Kill any existing processes on port 4477
echo "Checking for existing processes on port 4477..."
kill -9 $(lsof -t -i:4477) 2>/dev/null || true

# Navigate to server directory
cd server || { echo "Server directory not found"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the server
echo "Starting database-based mock server..."
NODE_OPTIONS='--max-old-space-size=256' npx ts-node src/data-based-mock-server.ts &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Check if server is running
if ! curl -s http://localhost:4477/health > /dev/null; then
  echo "Failed to start database-based mock server"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo "Database-based mock server running successfully on port 4477"
echo "-----------------------------------------------------------"

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