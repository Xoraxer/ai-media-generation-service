#!/bin/bash

# Media Generation Service Docker Setup Script

echo "🚀 Media Generation Service Docker Setup"
echo "========================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env exists and has REPLICATE_API_TOKEN
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

if grep -q "your_replicate_token_here" .env; then
    echo "⚠️  Please update your REPLICATE_API_TOKEN in .env file"
    echo "   Current value: your_replicate_token_here"
    echo "   Get your token from: https://replicate.com/account/api-tokens"
fi

echo ""
echo "🏗️  Building Docker images..."
docker-compose build

echo ""
echo "🔄 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Service URLs:"
echo "   🌐 FastAPI App:     http://localhost:8000"
echo "   📚 API Docs:        http://localhost:8000/docs"
echo "   ⚛️  React Frontend:  http://localhost:3000"
echo "   🔴 Redis:           localhost:6379"
echo ""
echo "📊 Check service status:"
echo "   docker compose ps"
echo ""
echo "📜 View logs:"
echo "   docker compose logs -f web"
echo "   docker compose logs -f frontend"
echo "   docker compose logs -f worker"
echo ""
echo "🛑 Stop services:"
echo "   docker compose down" 