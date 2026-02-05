#!/bin/bash

# Build and push Docker images to Docker Hub
# Version 1.5 - SOLID Principles Refactoring

set -e

VERSION="1.5"
DOCKER_USER="dpstrip"

echo "=========================================="
echo "Building Docker Images - Version $VERSION"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build CouchDB image
echo -e "${BLUE}Building CouchDB image...${NC}"
docker build -t $DOCKER_USER/joke-couch-db:$VERSION -t $DOCKER_USER/joke-couch-db:latest ./couchdb/docker
echo -e "${GREEN}✓ CouchDB image built${NC}"

# Build API image
echo -e "${BLUE}Building API image...${NC}"
docker build -t $DOCKER_USER/joke-couch-api:$VERSION -t $DOCKER_USER/joke-couch-api:latest ./api
echo -e "${GREEN}✓ API image built${NC}"

# Build Web image
echo -e "${BLUE}Building Web image...${NC}"
docker build -t $DOCKER_USER/joke-couch-web:$VERSION -t $DOCKER_USER/joke-couch-web:latest ./web
echo -e "${GREEN}✓ Web image built${NC}"

echo ""
echo "=========================================="
echo "Docker Images Built Successfully!"
echo "=========================================="
docker images | grep joke-couch

echo ""
echo -e "${YELLOW}Ready to push to Docker Hub!${NC}"
echo ""
read -p "Do you want to push these images to Docker Hub now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "=========================================="
    echo "Pushing to Docker Hub..."
    echo "=========================================="
    
    # Check if logged in
    if ! docker info | grep -q "Username"; then
        echo -e "${YELLOW}Please login to Docker Hub:${NC}"
        docker login
    fi
    
    # Push CouchDB images
    echo -e "${BLUE}Pushing CouchDB images...${NC}"
    docker push $DOCKER_USER/joke-couch-db:$VERSION
    docker push $DOCKER_USER/joke-couch-db:latest
    echo -e "${GREEN}✓ CouchDB images pushed${NC}"
    
    # Push API images
    echo -e "${BLUE}Pushing API images...${NC}"
    docker push $DOCKER_USER/joke-couch-api:$VERSION
    docker push $DOCKER_USER/joke-couch-api:latest
    echo -e "${GREEN}✓ API images pushed${NC}"
    
    # Push Web images
    echo -e "${BLUE}Pushing Web images...${NC}"
    docker push $DOCKER_USER/joke-couch-web:$VERSION
    docker push $DOCKER_USER/joke-couch-web:latest
    echo -e "${GREEN}✓ Web images pushed${NC}"
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}All images pushed successfully!${NC}"
    echo "=========================================="
    echo ""
    echo "Images available on Docker Hub:"
    echo "  • docker pull $DOCKER_USER/joke-couch-db:$VERSION"
    echo "  • docker pull $DOCKER_USER/joke-couch-api:$VERSION"
    echo "  • docker pull $DOCKER_USER/joke-couch-web:$VERSION"
    echo ""
else
    echo ""
    echo "Skipping push to Docker Hub."
    echo ""
    echo "To push manually later, run:"
    echo "  docker push $DOCKER_USER/joke-couch-db:$VERSION"
    echo "  docker push $DOCKER_USER/joke-couch-db:latest"
    echo "  docker push $DOCKER_USER/joke-couch-api:$VERSION"
    echo "  docker push $DOCKER_USER/joke-couch-api:latest"
    echo "  docker push $DOCKER_USER/joke-couch-web:$VERSION"
    echo "  docker push $DOCKER_USER/joke-couch-web:latest"
    echo ""
fi

echo "Done!"
