#!/bin/sh
set -e

# Start the official entrypoint in background, then run couchdb
/docker-entrypoint.sh couchdb &

# Wait for CouchDB to be available
echo "Waiting for CouchDB to be available..."
until curl -s -u "$COUCHDB_USER:$COUCHDB_PASSWORD" http://127.0.0.1:5984/ >/dev/null 2>&1; do
  sleep 1
done

# Create database if missing
echo "Creating database 'jokes' if it does not exist..."
curl -s -u "$COUCHDB_USER:$COUCHDB_PASSWORD" -X PUT http://127.0.0.1:5984/jokes || true

# Bulk insert documents (ignores conflicts)
echo "Seeding jokes..."
curl -s -u "$COUCHDB_USER:$COUCHDB_PASSWORD" -X POST http://127.0.0.1:5984/jokes/_bulk_docs \
  -H "Content-Type: application/json" -d @/jokes.json || true

# Keep couchdb process in foreground
wait
