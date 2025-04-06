#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Using default configuration."
fi

# Stop any existing processes
echo "Stopping any existing processes on server port..."
kill -9 $(lsof -t -i:${SERVER_PORT:-7777}) 2>/dev/null || true

# Set memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=256"

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  cd server && npm install && cd ..
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the server
echo "Starting the PG&E Substation Operations Assistant server..."
cd server && npm start

# Exit with the same code as the npm start command
exit $? 