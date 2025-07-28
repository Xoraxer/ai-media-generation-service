#!/bin/bash

echo "🧪 Testing Media Generation Service Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local url=$1
    local description=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $description... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response_code)"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $response_code, expected $expected_code)"
        return 1
    fi
}

# Wait for services to start
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

echo ""
echo "🔍 Testing Service Health:"

# Test backend health
test_endpoint "http://localhost:8000/api/v1/health" "Backend API Health"

# Test frontend
test_endpoint "http://localhost:3000" "Frontend Application"

# Test API documentation
test_endpoint "http://localhost:8000/docs" "API Documentation"

echo ""
echo "🚀 Testing Core Functionality:"

# Test image generation (this will return 202 for async processing)
echo -n "Testing image generation endpoint... "
response=$(curl -s -X POST "http://localhost:8000/api/v1/generate" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "test image", "model": "stability-ai/stable-diffusion-3"}')

if echo "$response" | grep -q "job_id"; then
    echo -e "${GREEN}✓ OK${NC} (Job created successfully)"
    
    # Extract job ID and test status endpoint
    job_id=$(echo "$response" | grep -o '"job_id":"[^"]*"' | cut -d'"' -f4)
    echo "📋 Job ID: $job_id"
    
    # Test status endpoint
    test_endpoint "http://localhost:8000/api/v1/status/$job_id" "Job Status Endpoint"
    
else
    echo -e "${RED}✗ FAILED${NC} (No job_id in response)"
fi

# Test jobs listing
test_endpoint "http://localhost:8000/api/v1/jobs" "Jobs Listing"

echo ""
echo "📊 Service Status:"
echo "=================="

# Check Docker containers
echo "Docker containers:"
cd media-generation-service && docker compose ps

echo ""
echo "🎉 Setup test completed!"
echo ""
echo "If all tests passed, your setup is working correctly!"
echo "Access the application at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"