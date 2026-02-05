# Docker Hub Deployment - Version 1.5

## 🚀 Quick Deploy

Run this single command to build and push all images:

```bash
./build-and-push-images.sh
```

Or follow the manual steps below.

---

## 📦 Manual Build and Push Commands

### Step 1: Build All Images

```bash
# Build CouchDB image
docker build -t dpstrip/joke-couch-db:1.5 -t dpstrip/joke-couch-db:latest ./couchdb/docker

# Build API image  
docker build -t dpstrip/joke-couch-api:1.5 -t dpstrip/joke-couch-api:latest ./api

# Build Web image
docker build -t dpstrip/joke-couch-web:1.5 -t dpstrip/joke-couch-web:latest ./web
```

### Step 2: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub credentials when prompted.

### Step 3: Push All Images

```bash
# Push CouchDB images
docker push dpstrip/joke-couch-db:1.5
docker push dpstrip/joke-couch-db:latest

# Push API images
docker push dpstrip/joke-couch-api:1.5
docker push dpstrip/joke-couch-api:latest

# Push Web images
docker push dpstrip/joke-couch-web:1.5
docker push dpstrip/joke-couch-web:latest
```

---

## ✅ Verification

After pushing, verify the images on Docker Hub:

- https://hub.docker.com/r/dpstrip/joke-couch-db/tags
- https://hub.docker.com/r/dpstrip/joke-couch-api/tags
- https://hub.docker.com/r/dpstrip/joke-couch-web/tags

---

## 🎯 What's in Version 1.5?

**SOLID Principles Refactoring** - Complete architectural improvements:

✅ Single Responsibility Principle - Each class has one clear purpose
✅ Open/Closed Principle - Open for extension, closed for modification
✅ Liskov Substitution Principle - Implementations are interchangeable
✅ Interface Segregation Principle - Small, focused interfaces
✅ Dependency Inversion Principle - Depends on abstractions

**Changes:**
- Refactored API backend with layered architecture (interfaces, adapters, repositories, services, controllers)
- Refactored Web frontend with service layer, custom hooks, and separation of concerns
- Added comprehensive SOLID comments throughout codebase
- Created extensive documentation (SOLID_REFACTORING.md, SOLID_ARCHITECTURE.md, SOLID_TESTING_EXAMPLES.md)
- Improved testability and maintainability

---

## 🌐 Deploy Using Version 1.5

Update your deployment to use the new images:

```bash
docker-compose -f docker-compose.images.yml up -d
```

Or pull individually:

```bash
docker pull dpstrip/joke-couch-db:1.5
docker pull dpstrip/joke-couch-api:1.5
docker pull dpstrip/joke-couch-web:1.5
```

---

## 📊 Image Sizes (Approximate)

- **CouchDB**: ~300MB
- **API**: ~200MB
- **Web**: ~150MB

All images use multi-stage builds for optimal size.

---

## 🔄 Changelog

### Version 1.5 (Current)
- ✨ Complete SOLID principles refactoring
- 📚 Comprehensive documentation added
- 🏗️ Layered architecture implementation
- 🧪 Enhanced testability

### Version 1.4 (Previous)
- Basic functionality
- Monolithic structure
