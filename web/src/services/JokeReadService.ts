// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: managing joke read operations

import { Joke } from '@/types/joke';
import { IJokeReadService, IHttpClient } from '@/interfaces/IApiService';

// SOLID: Dependency Inversion Principle (DIP)
// Depends on IHttpClient abstraction, not concrete implementation
export class JokeReadService implements IJokeReadService {
  constructor(private httpClient: IHttpClient) {}

  // SOLID: Open/Closed Principle (OCP)
  // Can be extended with new read operations without modifying existing ones
  async getJokes(): Promise<Joke[]> {
    return this.httpClient.request<Joke[]>('/jokes');
  }

  async getJoke(id: string): Promise<Joke> {
    return this.httpClient.request<Joke>(`/jokes/${id}`);
  }

  async getRandomJoke(): Promise<Joke> {
    return this.httpClient.request<Joke>('/jokes/random');
  }
}
