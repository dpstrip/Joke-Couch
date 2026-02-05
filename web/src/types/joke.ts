// SOLID: Interface Segregation Principle (ISP)
// Interfaces are small and focused on specific use cases

// SOLID: Single Responsibility Principle (SRP)
// Each interface has a single, well-defined purpose

// Complete joke entity from the database
export interface Joke {
  _id: string;
  _rev?: string;
  setup: string;
  punchline: string;
}

// Input for creating or updating jokes (without database metadata)
export interface JokeInput {
  setup: string;
  punchline: string;
}

// Generic API response structure
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}