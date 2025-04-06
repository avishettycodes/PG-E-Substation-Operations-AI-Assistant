#!/bin/bash

echo "Starting PG&E Substation Assistant test web server..."

# Kill any processes on port 4477
echo "Checking for existing processes on port 4477..."
kill -9 $(lsof -ti:4477) 2>/dev/null || true
kill -9 $(lsof -ti:7777) 2>/dev/null || true

# Set memory limit
echo "Setting memory limits..."
export NODE_OPTIONS='--max-old-space-size=512'

# Install any missing dependencies
echo "Checking for dependencies..."
cd server
npm install express-rate-limit jsonwebtoken @types/jsonwebtoken --save > /dev/null
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies. Please check your network connection."
  exit 1
fi

# Run the server with the test web interface
echo "Starting test web server with optimized settings..."
# Set an aggressive garbage collection - don't rely on --expose-gc flag
node --optimize_for_size --max_old_space_size=512 --gc_interval=100 $(which npx) ts-node src/test-web-server.ts

# If the server fails to start
if [ $? -ne 0 ]; then
  echo "Failed to start the test web server. Please check the error message above."
  exit 1
fi 