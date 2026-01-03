#!/bin/bash

echo "🚀 Testing Joke Couch Web Application Setup"
echo "=========================================="

# Test 1: Check if all files exist
echo "✅ Checking file structure..."
cd /workspaces/Joke-Couch/web

if [ -f "package.json" ]; then
    echo "   ✓ package.json exists"
else
    echo "   ✗ package.json missing"
    exit 1
fi

if [ -f "next.config.js" ]; then
    echo "   ✓ next.config.js exists"
else
    echo "   ✗ next.config.js missing"
    exit 1
fi

if [ -f "src/app/page.tsx" ]; then
    echo "   ✓ Main page component exists"
else
    echo "   ✗ Main page component missing"
    exit 1
fi

if [ -d "src/components" ]; then
    echo "   ✓ Components directory exists"
else
    echo "   ✗ Components directory missing"
    exit 1
fi

# Test 2: Check if dependencies are installed
echo ""
echo "✅ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✓ Node modules installed"
else
    echo "   ✗ Node modules not installed"
    exit 1
fi

# Test 3: Test build
echo ""
echo "✅ Testing production build..."
if npm run build > /dev/null 2>&1; then
    echo "   ✓ Build successful"
else
    echo "   ✗ Build failed"
    exit 1
fi

# Test 4: Test TypeScript compilation
echo ""
echo "✅ Testing TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo "   ✓ TypeScript compilation successful"
else
    echo "   ✗ TypeScript compilation failed"
    exit 1
fi

# Test 5: Check Docker configuration
echo ""
echo "✅ Checking Docker configuration..."
cd ..
if grep -q "web:" docker-compose.yml; then
    echo "   ✓ Web service configured in docker-compose.yml"
else
    echo "   ✗ Web service not configured in docker-compose.yml"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The Next.js web application is ready."
echo ""
echo "📋 Quick Start:"
echo "   Development: cd web && npm run dev"
echo "   Production:  docker-compose up web"
echo "   Full Stack:  docker-compose up"
echo ""
echo "🌐 Access URLs:"
echo "   Development: http://localhost:3000"
echo "   Production:  http://localhost:8080"
echo "   API:         http://localhost:3000/docs"