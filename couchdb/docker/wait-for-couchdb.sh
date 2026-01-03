#!/usr/bin/env sh
set -e

# Wait for CouchDB to be available and healthy
COUCH_HOST=${COUCH_HOST:-couchdb}
COUCH_PORT=${COUCH_PORT:-5984}
MAX_RETRIES=${MAX_RETRIES:-30}
SLEEP=${SLEEP:-2}

echo "Waiting for CouchDB at http://${COUCH_HOST}:${COUCH_PORT} ..."
count=0
until curl -sSf "http://${COUCH_HOST}:${COUCH_PORT}/" >/dev/null 2>&1; do
  count=$((count+1))
  if [ "$count" -ge "$MAX_RETRIES" ]; then
    echo "CouchDB did not become available after $((MAX_RETRIES * SLEEP)) seconds"
    exit 1
  fi
  sleep "$SLEEP"
done

echo "CouchDB is available"

# If first arg starts with '-' or is 'node' or 'npm', exec the CMD
if [ "${1#-}" != "$1" ] || [ "$1" = "node" ] || [ "$1" = "npm" ]; then
  exec "$@"
else
  # otherwise exec the original CMD
  exec "$@"
fi
