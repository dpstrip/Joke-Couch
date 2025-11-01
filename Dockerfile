FROM node:20-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY scripts/wait-for-couchdb.sh /usr/local/bin/wait-for-couchdb.sh
RUN chmod +x /usr/local/bin/wait-for-couchdb.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/wait-for-couchdb.sh"]
CMD ["node", "dist/server.js"]
