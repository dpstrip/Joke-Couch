'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Joke } from '@/types/joke';
import { JokeCard } from './JokeCard';

export const RandomJoke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomJoke = await apiClient.getRandomJoke();
      setJoke(randomJoke);
    } catch (err) {
      setError('Failed to fetch random joke. Please try again.');
      console.error('Error fetching random joke:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomJoke();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Joke</h2>
        <button
          onClick={fetchRandomJoke}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Loading...' : 'Get Another Joke'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {joke && !loading && (
        <JokeCard joke={joke} />
      )}
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};