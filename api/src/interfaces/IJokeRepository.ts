// SOLID: Interface Segregation Principle (ISP)
// Clients should not be forced to depend on interfaces they don't use
// SOLID: Dependency Inversion Principle (DIP)
// Depend on abstractions, not on concretions

export interface Joke {
  _id?: string;
  _rev?: string;
  setup: string;
  punchline: string;
  createdAt?: string;
}

export interface IJokeRepository {
  // Read operations
  findAll(): Promise<Joke[]>;
  findById(id: string): Promise<Joke | null>;
  findRandom(): Promise<Joke | null>;
  
  // Write operations
  create(joke: Omit<Joke, '_id' | '_rev'>): Promise<{ id: string; rev: string }>;
  update(id: string, joke: Partial<Joke>): Promise<{ ok: boolean; id: string; rev: string }>;
}
