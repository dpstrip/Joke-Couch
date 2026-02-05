// SOLID: Single Responsibility Principle (SRP)
// This hook has one responsibility: managing random joke state and operations

'use client';

import { useState, useCallback } from 'react';
import { Joke } from '@/types/joke';
import { jokeReadService } from '@/services';

interface UseRandomJokeResult {
  joke: Joke | null;
  loading: boolean;
  error: string | null;
  fetchRandomJoke: () => Promise<void>;
}

// SOLID: Open/Closed Principle (OCP)
// Custom hooks can be composed and extended without modification
export function useRandomJoke(): UseRandomJokeResult {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomJoke = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching random joke...');
      const randomJoke = await jokeReadService.getRandomJoke();
      console.log('Successfully got joke:', randomJoke);
      setJoke(randomJoke);
    } catch (err) {
      console.error('Full error object:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch random joke: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { joke, loading, error, fetchRandomJoke };
}
