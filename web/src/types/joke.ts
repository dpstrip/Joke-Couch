export interface Joke {
  _id: string;
  _rev?: string;
  setup: string;
  punchline: string;
}

export interface JokeInput {
  setup: string;
  punchline: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}