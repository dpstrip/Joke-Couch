// SOLID: Single Responsibility Principle (SRP)
// This file's responsibility is to create and export service instances

// SOLID: Dependency Inversion Principle (DIP)
// Services are composed from abstractions

import { HttpClient } from './HttpClient';
import { JokeReadService } from './JokeReadService';
import { JokeWriteService } from './JokeWriteService';

// Use Next.js API proxy for all environments
const API_BASE_URL = '/api';

// SOLID: Dependency Inversion Principle (DIP)
// Create dependencies from the composition root
const httpClient = new HttpClient(API_BASE_URL);
export const jokeReadService = new JokeReadService(httpClient);
export const jokeWriteService = new JokeWriteService(httpClient);
