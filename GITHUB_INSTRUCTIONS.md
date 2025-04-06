# Cloning and Setup Guide

This guide will help you get the PG&E Substation Operations Assistant up and running on your local machine.

## 1. Clone the Repository

```bash
git clone https://github.com/[organization]/pge-substation-assistant.git
cd pge-substation-assistant
```

## 2. Install Dependencies

```bash
# Install all required packages
npm install
```

## 3. Start the Application

### For the database-based server (recommended):

```bash
./run-db-server.sh
```

### For the simple mock server:

```bash
./run-mock-system.sh
```

## 4. Access the Application

Once running, you can access the application at:
- http://localhost:4477

## 5. Troubleshooting

If you encounter port conflicts:

```bash
# Kill processes on conflicting ports
kill -9 $(lsof -ti:7777) 2>/dev/null || true  # Server port
kill -9 $(lsof -ti:4477) 2>/dev/null || true  # Client port
```

If you experience memory issues:

```bash
# Run the server with limited memory in one terminal
cd server && NODE_OPTIONS='--max-old-space-size=256' npx ts-node src/data-based-mock-server.ts

# Run the client in another terminal
cd client && PORT=4477 npm start
```

See `TROUBLESHOOTING.md` for more detailed solutions to common issues. 