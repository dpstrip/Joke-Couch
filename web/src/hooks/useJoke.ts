// SOLID: Single Responsibility Principle (SRP)
// This hook has one responsibility: managing single joke fetch operations

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Joke } from '@/types/joke';
import { jokeReadService } from '@/services';

interface UseJokeResult {
  joke: Joke | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// SOLID: Open/Closed Principle (OCP)
// Custom hooks can be composed and extended without modification
export function useJoke(id: string): UseJokeResult {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJoke = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const jokeData = await jokeReadService.getJoke(id);
      setJoke(jokeData);
    } catch (err) {
      setError('Failed to load joke. Please try again.');
      console.error('Error loading joke:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  return { joke, loading, error, refetch: fetchJoke };
}
