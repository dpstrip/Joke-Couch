// SOLID: Interface Segregation Principle (ISP)
// Clients should not be forced to depend on interfaces they don't use
// SOLID: Dependency Inversion Principle (DIP)
// High-level modules depend on abstractions

import { Joke, JokeInput } from '@/types/joke';

// Separate interfaces for different concerns

export interface IHttpClient {
  request<T>(endpoint: string, options?: RequestInit): Promise<T>;
}

export interface IJokeReadService {
  getJokes(): Promise<Joke[]>;
  getJoke(id: string): Promise<Joke>;
  getRandomJoke(): Promise<Joke>;
}

export interface IJokeWriteService {
  createJoke(joke: JokeInput): Promise<{ id: string; rev: string }>;
  updateJoke(id: string, joke: JokeInput): Promise<{ ok: boolean; id: string; rev: string }>;
}

export interface IHealthCheckService {
  checkHealth(): Promise<{ ok: boolean }>;
}
