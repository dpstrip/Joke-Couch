// SOLID: Single Responsibility Principle (SRP)
// This hook has one responsibility: managing joke list state and operations

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Joke } from '@/types/joke';
import { jokeReadService } from '@/services';

interface UseJokesResult {
  jokes: Joke[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// SOLID: Open/Closed Principle (OCP)
// Custom hooks can be composed and extended without modification
export function useJokes(): UseJokesResult {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJokes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allJokes = await jokeReadService.getJokes();
      setJokes(allJokes);
    } catch (err) {
      setError('Failed to fetch jokes. Please try again.');
      console.error('Error fetching jokes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  return { jokes, loading, error, refetch: fetchJokes };
}
