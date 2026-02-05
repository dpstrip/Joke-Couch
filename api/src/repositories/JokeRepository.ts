// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: managing joke data persistence

import { IJokeRepository, Joke } from '../interfaces/IJokeRepository';
import { IDatabaseAdapter } from '../interfaces/IDatabaseAdapter';

// SOLID: Dependency Inversion Principle (DIP)
// Depends on IDatabaseAdapter abstraction, not concrete implementation
export class JokeRepository implements IJokeRepository {
  private lastRandomJokeId: string | null = null;

  constructor(private dbAdapter: IDatabaseAdapter) {}

  // SOLID: Open/Closed Principle (OCP)
  // Open for extension (can add new methods) but closed for modification
  async findAll(): Promise<Joke[]> {
    const result = await this.dbAdapter.list({ include_docs: true });
    const jokes = (result.rows || [])
      .map((row: any) => row.doc)
      .filter((doc: any) => doc && !doc._id.startsWith('_design/'));
    return jokes;
  }

  async findById(id: string): Promise<Joke | null> {
    try {
      const joke = await this.dbAdapter.get(id);
      return joke;
    } catch (error: any) {
      if (error && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async findRandom(): Promise<Joke | null> {
    const jokes = await this.findAll();
    
    if (jokes.length === 0) {
      return null;
    }

    if (jokes.length === 1) {
      return jokes[0];
    }

    // Avoid returning the same joke twice in a row
    let randomJoke: Joke;
    do {
      const randomIndex = Math.floor(Math.random() * jokes.length);
      randomJoke = jokes[randomIndex];
    } while (jokes.length > 1 && randomJoke?._id === this.lastRandomJokeId);
    
    this.lastRandomJokeId = randomJoke?._id ?? null;
    return randomJoke;
  }

  async create(joke: Omit<Joke, '_id' | '_rev'>): Promise<{ id: string; rev: string }> {
    const result = await this.dbAdapter.insert(joke);
    return { id: result.id, rev: result.rev };
  }

  async update(id: string, jokeData: Partial<Joke>): Promise<{ ok: boolean; id: string; rev: string }> {
    // Get existing document to retrieve its _rev
    const existing = await this.dbAdapter.get(id);
    
    // Merge new data with existing document
    const updatedJoke = {
      ...jokeData,
      _id: id,
      _rev: existing._rev
    };
    
    const result = await this.dbAdapter.insert(updatedJoke);
    return { ok: true, id: result.id, rev: result.rev };
  }
}
