# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm i --no-audit --no-fund --silent

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy package.json and install production deps
COPY package.json package-lock.json* ./
RUN npm ci --production --silent || npm i --only=prod --no-audit --no-fund --silent

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
