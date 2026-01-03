#!/bin/bash

# Update sample-joke
echo "Updating sample-joke..."
REV=$(curl -s http://admin:password@localhost:5984/jokes/sample-joke | jq -r '._rev')
curl -X PUT http://admin:password@localhost:5984/jokes/sample-joke \
  -H "Content-Type: application/json" \
  -d "{\"_rev\": \"$REV\", \"setup\": \"Why did the scarecrow win an award?\", \"punchline\": \"Because he was outstanding in his field.\", \"createdAt\": \"2025-11-06T00:00:00.000Z\"}"
echo ""

# Update programmer-joke
echo "Updating programmer-joke..."
REV=$(curl -s http://admin:password@localhost:5984/jokes/programmer-joke | jq -r '._rev')
curl -X PUT http://admin:password@localhost:5984/jokes/programmer-joke \
  -H "Content-Type: application/json" \
  -d "{\"_rev\": \"$REV\", \"setup\": \"Why did the programmer quit his job?\", \"punchline\": \"Because he didn't get arrays.\", \"createdAt\": \"2025-11-06T00:00:00.000Z\"}"
echo ""

echo "Done!"
