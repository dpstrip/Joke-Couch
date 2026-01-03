#!/bin/bash

echo "🐳 Joke Couch Web - Docker Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_status "Building the Joke Couch Web Docker image..."
docker build -t dpstrip/joke-couch-web:latest ./web/

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image."
    exit 1
fi

# Tag the image with version
print_status "Tagging image with version 1.0..."
docker tag dpstrip/joke-couch-web:latest dpstrip/joke-couch-web:1.0

print_status "Testing the container..."
# Test run the container
CONTAINER_ID=$(docker run -d --name joke-web-test -p 8080:3000 dpstrip/joke-couch-web:latest)

if [ $? -eq 0 ]; then
    print_success "Container started successfully with ID: ${CONTAINER_ID:0:12}"
    
    # Wait for the container to start
    sleep 5
    
    # Test if the web app is responding
    print_status "Testing web application response..."
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        print_success "Web application is responding correctly!"
    else
        print_warning "Web application test failed, but container is running."
    fi
    
    # Show container logs
    print_status "Container logs:"
    docker logs joke-web-test | head -10
    
    # Clean up test container
    print_status "Cleaning up test container..."
    docker stop joke-web-test > /dev/null 2>&1
    docker rm joke-web-test > /dev/null 2>&1
    
else
    print_error "Failed to start test container."
    exit 1
fi

print_status "Checking DockerHub authentication..."
if docker info 2>/dev/null | grep -q "Username:"; then
    print_success "Authenticated to DockerHub"
    
    print_status "Pushing images to DockerHub..."
    echo "  Pushing dpstrip/joke-couch-web:latest..."
    docker push dpstrip/joke-couch-web:latest
    
    echo "  Pushing dpstrip/joke-couch-web:1.0..."
    docker push dpstrip/joke-couch-web:1.0
    
    if [ $? -eq 0 ]; then
        print_success "Images pushed successfully to DockerHub!"
    else
        print_warning "Push failed. You may need to login with: docker login"
        print_status "Manual push commands:"
        echo "  docker push dpstrip/joke-couch-web:latest"
        echo "  docker push dpstrip/joke-couch-web:1.0"
    fi
else
    print_warning "Not authenticated to DockerHub."
    print_status "To push images to DockerHub, run:"
    echo "  docker login"
    echo "  docker push dpstrip/joke-couch-web:latest"
    echo "  docker push dpstrip/joke-couch-web:1.0"
fi

echo ""
print_success "Docker image is ready! Summary:"
echo "  📦 Image: dpstrip/joke-couch-web:latest"
echo "  📦 Image: dpstrip/joke-couch-web:1.0"
echo "  📏 Size: $(docker images dpstrip/joke-couch-web:latest --format 'table {{.Size}}' | tail -1)"
echo "  🚀 Test run: docker run -p 8080:3000 dpstrip/joke-couch-web:latest"
echo "  🌐 Access: http://localhost:8080"
echo ""
print_status "To run with the full stack:"
echo "  docker-compose up"
echo "  Web: http://localhost:8080"
echo "  API: http://localhost:3000"
echo "  CouchDB: http://localhost:5984"