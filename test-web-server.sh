#!/bin/bash

# PG&E Substation Operations AI Assistant Startup Script
# This script starts the consolidated web server for the PG&E Substation Operations AI Assistant

echo "Starting PG&E Substation Operations AI Assistant..."
echo "Checking for existing processes on port 4477..."

# Kill any existing process on port 4477
kill -9 $(lsof -ti:4477) 2>/dev/null || true

echo "Setting memory limits..."

# Set memory limits for Node.js
export NODE_OPTIONS="--max-old-space-size=512"

echo "Checking for dependencies..."

# Ensure dependencies are installed
if [ ! -d "server/node_modules" ]; then
  echo "Installing server dependencies..."
  cd server && npm install
  cd ..
fi

echo "Starting AI Assistant server..."

# Start the server with optimized settings
cd server && node --optimize_for_size --max_old_space_size=512 --gc_interval=100 $(which npx) ts-node src/test-web-server.ts

# Check if server started successfully
if [ $? -ne 0 ]; then
  echo "Failed to start the AI Assistant server. Please check the error message above."
  exit 1
fi 