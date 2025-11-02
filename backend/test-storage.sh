#!/bin/bash

echo "🧪 Supabase Storage Quick Test"
echo "=============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your Supabase credentials"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js to run the tests"
    exit 1
fi

# Check if npm packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Running storage tests..."
echo ""

# Run the comprehensive storage test
echo "1️⃣ Running comprehensive storage test..."
node test-storage.js

echo ""
echo "🚀 Running download service test..."
echo ""

# Run the download service test
echo "2️⃣ Running download service test..."
node test-download-service.js

echo ""
echo "🎉 All tests completed!"
echo "Check the output above for any errors."
echo ""
echo "If all tests pass, your Supabase Storage is ready for the pipeline!"


