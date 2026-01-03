#!/bin/bash

echo "🧪 Testing Joke Couch Web Application"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test 1: API Direct Access
print_test "Testing API direct access..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    print_success "API responding directly on port 3000"
else
    print_error "API not responding on port 3000"
    exit 1
fi

# Test 2: Web Application Access
print_test "Testing web application access..."
if curl -s http://localhost:8080 | grep -q "Joke Couch" > /dev/null 2>&1; then
    print_success "Web application responding on port 8080"
else
    print_error "Web application not responding on port 8080"
    exit 1
fi

# Test 3: Next.js API Proxy
print_test "Testing Next.js API proxy..."
if curl -s http://localhost:8080/api/health | grep -q "ok"; then
    print_success "API proxy working correctly"
else
    print_error "API proxy not working"
    exit 1
fi

# Test 4: Jokes Endpoint
print_test "Testing jokes endpoint through proxy..."
JOKES_RESPONSE=$(curl -s http://localhost:8080/api/jokes)
if echo "$JOKES_RESPONSE" | grep -q "_id" && echo "$JOKES_RESPONSE" | grep -q "joke"; then
    JOKE_COUNT=$(echo "$JOKES_RESPONSE" | grep -o "_id" | wc -l)
    print_success "Jokes endpoint working - found $JOKE_COUNT jokes"
else
    print_error "Jokes endpoint not working properly"
    exit 1
fi

# Test 5: Random Joke Endpoint
print_test "Testing random joke endpoint..."
if curl -s http://localhost:8080/api/jokes/random | grep -q "joke"; then
    print_success "Random joke endpoint working"
else
    print_error "Random joke endpoint not working"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "📋 Summary:"
echo "  ✅ API running on http://localhost:3000"
echo "  ✅ Web app running on http://localhost:8080"
echo "  ✅ API proxy working at /api/*"
echo "  ✅ All joke endpoints functional"
echo ""
echo "🌐 You can now access:"
echo "  • Website: http://localhost:8080"
echo "  • API Docs: http://localhost:3000/docs"
echo "  • CouchDB: http://localhost:5984"