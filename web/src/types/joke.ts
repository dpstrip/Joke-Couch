export interface Joke {
  _id: string;
  _rev?: string;
  joke: string;
  createdAt: string;
}

export interface JokeInput {
  joke: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}