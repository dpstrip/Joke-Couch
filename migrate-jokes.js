const fetch = require('node-fetch');

const COUCH_URL = 'http://admin:password@couchdb:5984';
const DB_NAME = 'jokes';

// Manual mapping of jokes to setup/punchline format
const jokeConversions = {
  'sample-joke': {
    setup: 'Why did the scarecrow win an award?',
    punchline: 'Because he was outstanding in his field.'
  },
  'programmer-joke': {
    setup: 'Why did the programmer quit his job?',
    punchline: "Because he didn't get arrays."
  }
};

async function migrateJokes() {
  try {
    console.log('Fetching all jokes...');
    const response = await fetch(`${COUCH_URL}/${DB_NAME}/_all_docs?include_docs=true`);
    const data = await response.json();
    
    const jokes = data.rows
      .filter(row => !row.id.startsWith('_design'))
      .map(row => row.doc);
    
    console.log(`Found ${jokes.length} jokes`);
    
    for (const joke of jokes) {
      // Skip if already has setup/punchline
      if (joke.setup && joke.punchline) {
        console.log(`Joke ${joke._id} already has setup/punchline format`);
        continue;
      }
      
      // Skip if no joke field
      if (!joke.joke) {
        console.log(`Joke ${joke._id} has no content to convert`);
        continue;
      }
      
      console.log(`Converting joke ${joke._id}...`);
      
      // Check if we have a manual conversion
      let setup, punchline;
      if (jokeConversions[joke._id]) {
        setup = jokeConversions[joke._id].setup;
        punchline = jokeConversions[joke._id].punchline;
      } else {
        // Try to auto-split the joke
        const jokeText = joke.joke;
        
        // Look for common patterns
        if (jokeText.includes('?')) {
          const parts = jokeText.split('?');
          setup = parts[0].trim() + '?';
          punchline = parts.slice(1).join('?').trim();
        } else {
          // Default: create a generic setup
          setup = "Here's a joke:";
          punchline = jokeText;
        }
      }
      
      // Create updated document
      const updatedJoke = {
        _id: joke._id,
        _rev: joke._rev,
        setup: setup,
        punchline: punchline
      };
      
      // Keep createdAt if it exists
      if (joke.createdAt) {
        updatedJoke.createdAt = joke.createdAt;
      }
      
      // Update in CouchDB
      const updateResponse = await fetch(`${COUCH_URL}/${DB_NAME}/${joke._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedJoke)
      });
      
      const result = await updateResponse.json();
      
      if (result.ok) {
        console.log(`✓ Updated ${joke._id}`);
      } else {
        console.error(`✗ Failed to update ${joke._id}:`, result);
      }
    }
    
    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateJokes();
