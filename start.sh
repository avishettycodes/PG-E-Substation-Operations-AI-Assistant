#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Using default configuration."
fi

# Stop any existing processes
echo "Stopping any existing processes..."
kill -9 $(lsof -t -i:$PORT) 2>/dev/null || true
kill -9 $(lsof -t -i:$SERVER_PORT) 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
fi

if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
  echo "Installing client dependencies..."
  cd client && npm install && cd ..
fi

# Start the application
echo "Starting the PG&E Substation Operations Assistant..."
npm start

# Exit with the same code as the npm start command
exit $? 