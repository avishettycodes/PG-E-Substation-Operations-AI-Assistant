#!/bin/bash

echo "Starting React client for mock server..."

# Set environment variables
export PORT=3000
export NODE_OPTIONS='--max-old-space-size=256'
export REACT_APP_API_URL=http://localhost:4477/api

# Change to client directory
cd client

# Start React client
npm start

# Exit with the same code as the npm start command
exit $? 