// SOLID: Single Responsibility Principle (SRP)
// This component has one responsibility: displaying a random joke
// Data fetching is delegated to custom hooks

'use client';

import React, { useEffect } from 'react';
import { JokeCard } from './JokeCard';
import { useRandomJoke } from '@/hooks/useRandomJoke';

// SOLID: Open/Closed Principle (OCP)
// Component is open for extension through props, closed for modification
export const RandomJoke: React.FC = () => {
  const { joke, loading, error, fetchRandomJoke } = useRandomJoke();

  useEffect(() => {
    fetchRandomJoke();
  }, [fetchRandomJoke]);

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