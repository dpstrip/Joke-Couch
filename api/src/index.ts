import dotenv from 'dotenv';
import { initDB } from './db';

dotenv.config();

async function main() {
  try {
    const db = await initDB('jokes');

    const doc = {
      _id: 'sample-joke',
      joke: "Why did the scarecrow win an award? Because he was outstanding in his field.",
      createdAt: new Date().toISOString()
    };

    try {
      await db.insert(doc);
      console.log('Inserted sample joke');
    } catch (err: any) {
      if (err && err.statusCode === 409) {
        console.log('Sample document already exists');
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error('Failed to initialize CouchDB connection:', err);
    process.exit(1);
  }
}

main();
