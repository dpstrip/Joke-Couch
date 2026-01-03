'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

interface AddJokeFormProps {
  onJokeAdded?: () => void;
}

export const AddJokeForm: React.FC<AddJokeFormProps> = ({ onJokeAdded }) => {
  const [joke, setJoke] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joke.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      await apiClient.createJoke({ joke: joke.trim() });
      setJoke('');
      setMessage('Joke added successfully!');
      if (onJokeAdded) {
        onJokeAdded();
      }
    } catch (error) {
      setMessage('Failed to add joke. Please try again.');
      console.error('Error adding joke:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add a New Joke</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={joke}
            onChange={(e) => setJoke(e.target.value)}
            placeholder="Enter your joke here..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isSubmitting || !joke.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? 'Adding...' : 'Add Joke'}
          </button>
          {message && (
            <span className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};