#!/bin/bash

# PG&E Substation Operations Assistant API Testing Script
echo "==== Testing PG&E Substation Operations Assistant API ===="
echo

# Set the port
PORT=7777

# Test the health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:$PORT/health)
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
  echo "✅ Health endpoint is working correctly"
else
  echo "❌ Health endpoint is not working correctly"
  echo "Response: $HEALTH_RESPONSE"
fi
echo

# Test asset health query
echo "Testing asset health query..."
HEALTH_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"What is the health status of Transformer T-123?"}')
if [[ $HEALTH_QUERY_RESPONSE == *"health score"* ]]; then
  echo "✅ Asset health query is working correctly"
else
  echo "❌ Asset health query is not working correctly"
  echo "Response: $HEALTH_QUERY_RESPONSE"
fi
echo

# Test real-time data query
echo "Testing real-time data query..."
REALTIME_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"What is the current temperature at Substation S-567?"}')
if [[ $REALTIME_QUERY_RESPONSE == *"Temperature"* ]]; then
  echo "✅ Real-time data query is working correctly"
else
  echo "❌ Real-time data query is not working correctly"
  echo "Response: $REALTIME_QUERY_RESPONSE"
fi
echo

# Test maintenance schedule query
echo "Testing maintenance schedule query..."
MAINTENANCE_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"What maintenance is scheduled for Transformer T-123?"}')
if [[ $MAINTENANCE_QUERY_RESPONSE == *"scheduled maintenance"* ]]; then
  echo "✅ Maintenance schedule query is working correctly"
else
  echo "❌ Maintenance schedule query is not working correctly"
  echo "Response: $MAINTENANCE_QUERY_RESPONSE"
fi
echo

# Test safety guidelines query
echo "Testing safety guidelines query..."
SAFETY_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"What are the safety guidelines for breaker racking?"}')
if [[ $SAFETY_QUERY_RESPONSE == *"PPE"* ]]; then
  echo "✅ Safety guidelines query is working correctly"
else
  echo "❌ Safety guidelines query is not working correctly"
  echo "Response: $SAFETY_QUERY_RESPONSE"
fi
echo

# Test inventory query
echo "Testing inventory query..."
INVENTORY_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"Do we have spare bushings available for Transformer T-987?"}')
if [[ $INVENTORY_QUERY_RESPONSE == *"Bushings"* || $INVENTORY_QUERY_RESPONSE == *"available"* ]]; then
  echo "✅ Inventory query is working correctly"
else
  echo "❌ Inventory query is not working correctly"
  echo "Response: $INVENTORY_QUERY_RESPONSE"
fi
echo

# Test geofencing query
echo "Testing geofencing query..."
GEOFENCING_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"Am I within the geofenced area for Transformer T-123?"}')
if [[ $GEOFENCING_QUERY_RESPONSE == *"allowed area"* ]]; then
  echo "✅ Geofencing query is working correctly"
else
  echo "❌ Geofencing query is not working correctly"
  echo "Response: $GEOFENCING_QUERY_RESPONSE"
fi
echo

# Test off-topic query
echo "Testing off-topic query..."
OFFTOPIC_QUERY_RESPONSE=$(curl -s http://localhost:$PORT/api/chat/query -X POST -H "Content-Type: application/json" -d '{"message":"What is the weather like today?"}')
if [[ $OFFTOPIC_QUERY_RESPONSE == *"I apologize"* || $OFFTOPIC_QUERY_RESPONSE == *"substation operations"* ]]; then
  echo "✅ Off-topic query handling is working correctly"
else
  echo "❌ Off-topic query handling is not working correctly"
  echo "Response: $OFFTOPIC_QUERY_RESPONSE"
fi
echo

# Test static image serving
echo "Testing static image serving..."
IMAGE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/images/substation-background.jpg)
if [[ $IMAGE_RESPONSE == "200" ]]; then
  echo "✅ Static image serving is working correctly"
else
  echo "❌ Static image serving is not working correctly"
  echo "Response code: $IMAGE_RESPONSE"
fi
echo

# Test static HTML serving
echo "Testing static HTML serving..."
HTML_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/)
if [[ $HTML_RESPONSE == "200" ]]; then
  echo "✅ Static HTML serving is working correctly"
else
  echo "❌ Static HTML serving is not working correctly"
  echo "Response code: $HTML_RESPONSE"
fi
echo

echo "==== Testing Complete ====" 