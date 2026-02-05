// SOLID: Single Responsibility Principle (SRP)
// This class has one responsibility: making HTTP requests

import { IHttpClient } from '@/interfaces/IApiService';

// SOLID: Open/Closed Principle (OCP)
// Can be extended without modification (e.g., add interceptors, auth)
export class HttpClient implements IHttpClient {
  constructor(private baseUrl: string) {}

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
