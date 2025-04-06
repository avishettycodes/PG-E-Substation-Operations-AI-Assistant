#!/bin/bash

echo "Starting PG&E Substation Assistant deployment process..."

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
  echo "Failed to install server dependencies. Aborting."
  exit 1
fi

# Install additional required packages
echo "Installing additional required packages..."
npm install express-rate-limit jsonwebtoken @types/jsonwebtoken --save
if [ $? -ne 0 ]; then
  echo "Failed to install additional packages. Aborting."
  exit 1
fi

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
  echo "Failed to install client dependencies. Aborting."
  exit 1
fi

# Build the client
echo "Building the client application..."
npm run build
if [ $? -ne 0 ]; then
  echo "Failed to build client. Aborting."
  exit 1
fi

# Create the public directory in server
echo "Copying client build to server/public..."
mkdir -p ../server/public
cp -r build/* ../server/public/

# Go back to root
cd ..

echo "Deployment preparation completed successfully!"
echo "Your application is ready to be deployed to Render"
echo ""
echo "Next steps:"
echo "1. Push these changes to your GitHub repository"
echo "2. Connect your repository to Render.com"
echo "3. Create a new Web Service using the following command to start the server:"
echo "   cd server && node --optimize_for_size --max_old_space_size=512 --gc_interval=100 $(which npx) ts-node src/web-server.ts"
echo ""
echo "Your application will be available online after the deployment completes." 