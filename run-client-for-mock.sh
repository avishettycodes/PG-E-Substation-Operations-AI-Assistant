#!/bin/bash

# Kill any processes on the client port
echo "Stopping any existing processes on client port..."
kill -9 $(lsof -t -i:4477) 2>/dev/null || true

# Set environment variables for the client
export REACT_APP_API_URL=http://localhost:7777/api

# Start the client
echo "Starting the PG&E Substation Operations Assistant client..."
cd client && npm start

# Exit with the same code as the npm start command
exit $? 