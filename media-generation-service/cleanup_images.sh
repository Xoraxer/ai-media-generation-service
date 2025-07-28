#!/bin/bash

# Image cleanup script for media generation service
# This script fixes incorrect image paths and removes jobs with missing images

API_BASE="http://localhost:8000/api/v1"

echo "🧹 Starting image cleanup process..."

echo "📁 Step 1: Fixing incorrect image paths..."
FIXED_RESPONSE=$(curl -s -X POST "$API_BASE/jobs/fix-paths")
FIXED_COUNT=$(echo "$FIXED_RESPONSE" | jq -r '.fixed_count // 0')
echo "✅ Fixed $FIXED_COUNT jobs with incorrect paths"

echo "🗑️  Step 2: Removing jobs with missing image files..."
DELETED_RESPONSE=$(curl -s -X DELETE "$API_BASE/jobs/missing-images")
DELETED_COUNT=$(echo "$DELETED_RESPONSE" | jq -r '.deleted_count // 0')
echo "✅ Deleted $DELETED_COUNT jobs with missing images"

echo "🧽 Step 3: Removing failed jobs..."
FAILED_RESPONSE=$(curl -s -X DELETE "$API_BASE/jobs/failed")
FAILED_COUNT=$(echo "$FAILED_RESPONSE" | jq -r '.deleted_count // 0')
echo "✅ Deleted $FAILED_COUNT failed jobs"

echo ""
echo "🎉 Cleanup completed!"
echo "   - Fixed paths: $FIXED_COUNT"
echo "   - Removed missing: $DELETED_COUNT"
echo "   - Removed failed: $FAILED_COUNT"

# Show current status
echo ""
echo "📊 Current job counts:"
COMPLETED_COUNT=$(curl -s "$API_BASE/jobs/completed" | jq '. | length')
echo "   - Completed jobs: $COMPLETED_COUNT"