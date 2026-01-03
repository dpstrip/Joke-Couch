'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

interface AddJokeFormProps {
  onJokeAdded?: () => void;
}

export const AddJokeForm: React.FC<AddJokeFormProps> = ({ onJokeAdded }) => {
  const [setup, setSetup] = useState('');
  const [punchline, setPunchline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setup.trim() || !punchline.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      await apiClient.createJoke({ 
        setup: setup.trim(),
        punchline: punchline.trim()
      });
      setSetup('');
      setPunchline('');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Setup
          </label>
          <textarea
            value={setup}
            onChange={(e) => setSetup(e.target.value)}
            placeholder="Enter the setup (e.g., Why did the chicken cross the road?)"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Punchline
          </label>
          <textarea
            value={punchline}
            onChange={(e) => setPunchline(e.target.value)}
            placeholder="Enter the punchline (e.g., To get to the other side!)"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isSubmitting || !setup.trim() || !punchline.trim()}
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