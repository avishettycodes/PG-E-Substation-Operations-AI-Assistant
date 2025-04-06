# Environment Configuration Setup

The PG&E Substation Operations Assistant uses a central `.env` file to manage all configuration settings. This file includes settings for both the client and server components, API keys, database configurations, and more.

## Setting Up Your OpenAI API Key

1. **Get an OpenAI API Key**:
   - Go to [platform.openai.com](https://platform.openai.com/account/api-keys)
   - Sign up or log in to your OpenAI account
   - Navigate to the API Keys section
   - Click "Create new secret key"
   - Give your key a name (e.g., "PG&E Assistant")
   - Copy the key (you won't be able to see it again)

2. **Edit the `.env` File**:
   - Open the `.env` file in the root directory
   - Find the line that says:
     ```
     OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
     ```
   - Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key
   - Save the file

## Installing Dependencies

Before starting the application, you need to install the necessary dependencies:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install
cd ..

# Install client dependencies
cd client && npm install
cd ..

# Install SQLite dependencies (if you encounter database errors)
cd server && npm install sqlite sqlite3
cd ..
```

## Understanding the Configuration

The `.env` file is organized into sections:

### API Keys
```
OPENAI_API_KEY=your_key_here
```
This is where you add your OpenAI API key.

### Server Configuration
```
SERVER_PORT=7777
NODE_ENV=development
```
- `SERVER_PORT`: The port on which the backend server runs
- `NODE_ENV`: Environment mode (development/production)

### Client Configuration
```
PORT=4477
REACT_APP_API_URL=http://localhost:7777/api
```
- `PORT`: The port on which the frontend client runs
- `REACT_APP_API_URL`: The URL the client uses to connect to the API

### Database Configuration
```
DB_PATH=./server/src/data/substation.db
```
- `DB_PATH`: Location of the SQLite database file

### Security Configuration
```
JWT_SECRET=pge-substation-operations-secret-key
CORS_ORIGIN=http://localhost:4477
```
- `JWT_SECRET`: Secret key for JWT token generation
- `CORS_ORIGIN`: Allowed origin for CORS requests

### Logging Configuration
```
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```
- `LOG_LEVEL`: Minimum log level to display
- `LOG_FILE_PATH`: Directory where log files are stored

## Starting the Application

After configuring the `.env` file, you can start the application using the provided startup script:

```bash
./start.sh
```

This script:
1. Loads all environment variables from the `.env` file
2. Stops any existing processes running on the configured ports
3. Installs dependencies if needed
4. Starts both the client and server components

## Troubleshooting

### API Key Issues
If you encounter an authentication error like:
```
Error in chat query: AuthenticationError: 401 Incorrect API key provided
```

This means your API key is invalid or not properly configured. Check that:
- You've copied the full API key correctly
- There are no extra spaces before or after the key
- The key hasn't expired or been revoked in your OpenAI account

### Database Issues
If you encounter errors related to the database:
```
Error: Cannot find module 'sqlite' or its corresponding type declarations
```

Install the SQLite dependencies:
```bash
cd server && npm install sqlite sqlite3
```

### Port in Use Issues
If you see an error about ports already in use:
```
Something is already running on port 4477
```

Make sure to kill any existing processes using those ports before starting:
```bash
kill -9 $(lsof -t -i:4477) 2>/dev/null || true
kill -9 $(lsof -t -i:7777) 2>/dev/null || true
``` 