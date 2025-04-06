#!/bin/bash

# PG&E Substation Operations AI Assistant Startup Script
# This script starts the consolidated web server for the PG&E Substation Operations AI Assistant

echo "Starting PG&E Substation Operations AI Assistant..."

# Check if running with sudo (not recommended)
if [ "$EUID" -eq 0 ]; then
  echo "Warning: Running as root is not recommended."
fi

# Check for existing processes on port 4477
PORT=4477
echo "Checking for existing processes on port $PORT..."
if command -v lsof >/dev/null 2>&1; then
  EXISTING_PID=$(lsof -t -i:$PORT)
  if [ ! -z "$EXISTING_PID" ]; then
    echo "Stopping existing process on port $PORT (PID: $EXISTING_PID)..."
    kill -9 $EXISTING_PID
  fi
fi

# Setting memory limits
echo "Setting memory limits..."
MEMORY_LIMIT=512
GC_INTERVAL=100

# Check if .env file exists and source it
if [ -f ".env" ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "Warning: .env file not found. Using default settings."
fi

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Warning: OPENAI_API_KEY is not set. The AI may have limited functionality."
  echo "Please create a .env file with your OpenAI API key to enable all features."
fi

# Check for dependencies
echo "Checking for dependencies..."
if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is not installed. Please install Node.js to continue."
  exit 1
fi

if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  cd server && npm install
  cd ..
fi

# Start the server
echo "Starting AI Assistant server..."
cd server && node --optimize_for_size --max_old_space_size=$MEMORY_LIMIT --gc_interval=$GC_INTERVAL $(which npx) ts-node src/test-web-server.ts

# Handle server exit
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "Error: Server exited with code $EXIT_CODE"
  echo "Check the logs above for details on what went wrong."
  exit $EXIT_CODE
fi 