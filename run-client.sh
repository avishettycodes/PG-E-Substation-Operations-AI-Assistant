#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Using default configuration."
fi

# Stop any existing processes
echo "Stopping any existing processes on client port..."
kill -9 $(lsof -t -i:${PORT:-4477}) 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "client/node_modules" ]; then
  echo "Installing client dependencies..."
  cd client && npm install && cd ..
fi

# Start the client
echo "Starting the PG&E Substation Operations Assistant client..."
cd client && npm start

# Exit with the same code as the npm start command
exit $? 