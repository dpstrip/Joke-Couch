import { Joke, JokeInput, ApiResponse } from '@/types/joke';

// Use Next.js API proxy for all environments
const API_BASE_URL = '/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getJokes(): Promise<Joke[]> {
    return this.request<Joke[]>('/jokes');
  }

  async getRandomJoke(): Promise<Joke> {
    return this.request<Joke>('/jokes/random');
  }

  async getJoke(id: string): Promise<Joke> {
    return this.request<Joke>(`/jokes/${id}`);
  }

  async createJoke(joke: JokeInput): Promise<{ id: string; rev: string }> {
    return this.request<{ id: string; rev: string }>('/jokes', {
      method: 'POST',
      body: JSON.stringify(joke),
    });
  }

  async checkHealth(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>('/health');
  }
}

export const apiClient = new ApiClient();