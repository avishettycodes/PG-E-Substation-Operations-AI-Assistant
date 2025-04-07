#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print a line of 50 asterisks
print_separator() {
  printf "%0.s*" {1..50}
  echo ""
}

# Start message
print_separator
echo -e "${GREEN}Starting PG&E Substation Operations AI Assistant...${NC}"
print_separator

# Check if a process is already running on the port
PORT=4477
echo "Checking for existing processes on port $PORT..."
if lsof -i :$PORT > /dev/null; then
  echo -e "${YELLOW}There's already a process running on port $PORT.${NC}"
  read -p "Do you want to kill it and start a new server? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping existing process..."
    kill $(lsof -t -i:$PORT) 2>/dev/null || true
    sleep 2
  else
    echo -e "${RED}Server startup cancelled by user.${NC}"
    exit 1
  fi
fi

# Memory configuration
echo "Setting memory limits..."
MEMORY_LIMIT=256

# Check for .env file
echo "Loading environment variables from .env file..."
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo -e "${YELLOW}Warning: No .env file found. Using default settings.${NC}"
fi

# Check dependencies
echo "Checking for dependencies..."
cd server

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies. Please check the error messages above.${NC}"
    exit 1
  fi
fi

# Start the server
echo "Starting AI Assistant server..."
NODE_OPTIONS="--max-old-space-size=$MEMORY_LIMIT" npx ts-node src/data-based-mock-server.ts

# Check if the server exited with an error
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Server exited with code $?${NC}"
  echo "Check the logs above for details on what went wrong."
  exit 1
fi