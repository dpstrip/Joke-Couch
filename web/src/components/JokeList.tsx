'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Joke } from '@/types/joke';
import { JokeCard } from './JokeCard';

export const JokeList: React.FC = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJokes = async () => {
    setLoading(true);
    setError(null);
    try {
      const allJokes = await apiClient.getJokes();
      setJokes(allJokes);
    } catch (err) {
      setError('Failed to fetch jokes. Please try again.');
      console.error('Error fetching jokes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-2 text-gray-600">Loading jokes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <button
          onClick={fetchJokes}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jokes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 text-lg">No jokes found. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Jokes ({jokes.length})</h2>
        <button
          onClick={fetchJokes}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {jokes.map((joke) => (
          <JokeCard key={joke._id} joke={joke} />
        ))}
      </div>
    </div>
  );
};