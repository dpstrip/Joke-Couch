// SOLID: Single Responsibility Principle (SRP)
// This module has one responsibility: initializing and providing database connections

import dotenv from 'dotenv';
import Nano from 'nano';

dotenv.config();

// SOLID: Open/Closed Principle (OCP)
// Configuration is open for extension through environment variables
const user = process.env.COUCH_USER || 'admin';
const pass = process.env.COUCH_PASSWORD || 'password';
const host = process.env.COUCH_HOST || 'localhost';
const port = process.env.COUCH_PORT || '5984';

const url = process.env.COUCH_URL || `http://${user}:${pass}@${host}:${port}`;

const nano = Nano(url);

// SOLID: Single Responsibility Principle (SRP)
// This function has one responsibility: waiting for CouchDB to be ready
async function waitForCouch(retries = 10, delayMs = 2000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await nano.db.list();
      return;
    } catch (err) {
      // wait
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('CouchDB not reachable after retries');
}

// SOLID: Single Responsibility Principle (SRP)
// This function has one responsibility: initializing a database
export async function initDB(dbName = 'jokes') {
  await waitForCouch();
  const dbs = await nano.db.list();
  if (!dbs.includes(dbName)) {
    await nano.db.create(dbName);
  }
  return nano.db.use(dbName);
}

export { nano };
