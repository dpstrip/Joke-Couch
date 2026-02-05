// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: implementing business logic for jokes

import { IJokeRepository, Joke } from '../interfaces/IJokeRepository';

// SOLID: Dependency Inversion Principle (DIP)
// Depends on IJokeRepository abstraction, not concrete implementation
export class JokeService {
  constructor(private jokeRepository: IJokeRepository) {}

  // SOLID: Open/Closed Principle (OCP)
  // Can extend with new business logic methods without modifying existing code
  
  async getAllJokes(): Promise<Joke[]> {
    return this.jokeRepository.findAll();
  }

  async getJokeById(id: string): Promise<Joke | null> {
    return this.jokeRepository.findById(id);
  }

  async getRandomJoke(): Promise<Joke | null> {
    return this.jokeRepository.findRandom();
  }

  async createJoke(jokeData: Omit<Joke, '_id' | '_rev'>): Promise<{ id: string; rev: string }> {
    // Business validation could go here
    if (!jokeData.setup || !jokeData.punchline) {
      throw new Error('Setup and punchline are required');
    }
    
    // Add timestamp if not provided
    const joke = {
      ...jokeData,
      createdAt: jokeData.createdAt || new Date().toISOString()
    };
    
    return this.jokeRepository.create(joke);
  }

  async updateJoke(id: string, jokeData: Partial<Joke>): Promise<{ ok: boolean; id: string; rev: string }> {
    // Business validation could go here
    const existingJoke = await this.jokeRepository.findById(id);
    if (!existingJoke) {
      throw new Error('Joke not found');
    }
    
    return this.jokeRepository.update(id, jokeData);
  }
}
