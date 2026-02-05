// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: managing joke write operations

import { JokeInput } from '@/types/joke';
import { IJokeWriteService, IHttpClient } from '@/interfaces/IApiService';

// SOLID: Dependency Inversion Principle (DIP)
// Depends on IHttpClient abstraction, not concrete implementation
export class JokeWriteService implements IJokeWriteService {
  constructor(private httpClient: IHttpClient) {}

  // SOLID: Open/Closed Principle (OCP)
  // Can be extended with new write operations without modifying existing ones
  async createJoke(joke: JokeInput): Promise<{ id: string; rev: string }> {
    return this.httpClient.request<{ id: string; rev: string }>('/jokes', {
      method: 'POST',
      body: JSON.stringify(joke),
    });
  }

  async updateJoke(
    id: string,
    joke: JokeInput
  ): Promise<{ ok: boolean; id: string; rev: string }> {
    return this.httpClient.request<{ ok: boolean; id: string; rev: string }>(
      `/jokes/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(joke),
      }
    );
  }
}
