#!/bin/bash

# CouchDB connection details
COUCH_URL="http://admin:password@localhost:5984"
DB_NAME="jokes"

echo "Fetching all jokes from CouchDB..."

# Get all documents
DOCS=$(curl -s "$COUCH_URL/$DB_NAME/_all_docs?include_docs=true" | jq -r '.rows[] | select(.id | startswith("_design") | not) | .doc')

echo "$DOCS" | jq -c '.' | while IFS= read -r doc; do
    ID=$(echo "$doc" | jq -r '._id')
    REV=$(echo "$doc" | jq -r '._rev')
    JOKE=$(echo "$doc" | jq -r '.joke // empty')
    SETUP=$(echo "$doc" | jq -r '.setup // empty')
    PUNCHLINE=$(echo "$doc" | jq -r '.punchline // empty')
    
    # If it has a 'joke' field but no 'setup', convert it
    if [ -n "$JOKE" ] && [ -z "$SETUP" ]; then
        echo "Converting joke: $ID"
        
        # Split the joke into setup and punchline
        # This is a simple split - you may want to manually review these
        if [[ "$JOKE" == *"?"* ]]; then
            # If there's a question mark, split there
            SETUP=$(echo "$JOKE" | sed 's/\(.*?\).*/\1/')
            PUNCHLINE=$(echo "$JOKE" | sed 's/.*? *//')
        elif [[ "$JOKE" == *"!"* ]]; then
            # If there's an exclamation, try to find a good split point
            SETUP=$(echo "$JOKE" | sed 's/\(.*\?\)/\1/' | head -c 100)
            PUNCHLINE=$(echo "$JOKE" | tail -c +101)
        else
            # Default: put everything in punchline, add generic setup
            SETUP="Here's a joke:"
            PUNCHLINE="$JOKE"
        fi
        
        # Create updated document
        UPDATED_DOC=$(echo "$doc" | jq --arg setup "$SETUP" --arg punchline "$PUNCHLINE" '. | del(.joke) | .setup = $setup | .punchline = $punchline')
        
        # Update the document in CouchDB
        echo "Updating $ID..."
        curl -X PUT "$COUCH_URL/$DB_NAME/$ID" \
            -H "Content-Type: application/json" \
            -d "$UPDATED_DOC"
        echo ""
    else
        echo "Joke $ID already has setup/punchline format or is empty"
    fi
done

echo "Migration complete!"
