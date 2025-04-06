# Troubleshooting Guide for PG&E Chatbot

## Key Issues and Solutions

### 1. Memory Issues
Your MacBook Air is running out of memory when both the client and server run together. The logs show `Killed: 9` (code 137), which occurs when the OS terminates a process due to memory constraints.

**Solution:**
- Run the server and client in separate terminal windows using our new scripts:
  ```bash
  # Terminal 1: Run server only
  npm run server-only
  
  # Terminal 2: Run client only
  npm run client-only
  ```

### 2. Port Conflicts
Port conflicts occur when multiple instances try to use the same port, showing errors like `Error: listen EADDRINUSE: address already in use :::7777`.

**Solution:**
- Our new scripts automatically kill any processes using the required ports
- If you still see port conflicts, run these manually:
  ```bash
  kill -9 $(lsof -t -i:7777) 2>/dev/null || true
  kill -9 $(lsof -t -i:4477) 2>/dev/null || true
  ```

### 3. OpenAI API Key Issues
The "Sorry, there was an error processing your request" message often appears when the OpenAI API key is missing or invalid.

**Solution:**
1. Edit the `.env` file and replace:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
   with your actual OpenAI API key.

2. After updating the key, restart both the server and client.

3. Test using this curl command:
   ```bash
   curl -X POST http://localhost:7777/api/chat/query \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello, can you tell me about PG&E substations?"}'
   ```

## Getting Started

1. **Setup environment:**
   ```bash
   npm run setup
   ```

2. **Start server in one terminal:**
   ```bash
   npm run server-only
   ```

3. **Start client in another terminal:**
   ```bash
   npm run client-only
   ```

4. **Access the application:** 
   Open your browser to http://localhost:4477

## Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `Sorry, there was an error processing your request` | Set a valid OpenAI API key in `.env` file |
| `Killed: 9` | Use `server-only` and `client-only` scripts to reduce memory usage |
| `EADDRINUSE` | Kill existing processes using required ports |
| Missing node modules | Run `npm run install-all` to install all dependencies |

## Performance Optimization

If you're still experiencing memory issues:

1. Reduce the Node.js memory limit by editing `NODE_OPTIONS` in `.env`:
   ```
   NODE_OPTIONS=--max-old-space-size=200
   ```

2. Use a lightweight model like `gpt-3.5-turbo` instead of `gpt-4` (already updated in the code)

3. Close other memory-intensive applications while running the PG&E Chatbot 