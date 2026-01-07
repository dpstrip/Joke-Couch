'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Joke, JokeInput } from '@/types/joke';
import Link from 'next/link';

export default function EditJokePage() {
  const router = useRouter();
  const params = useParams();
  const jokeId = params.id as string;

  const [joke, setJoke] = useState<Joke | null>(null);
  const [setup, setSetup] = useState('');
  const [punchline, setPunchline] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadJoke = async () => {
      try {
        setLoading(true);
        const jokeData = await apiClient.getJoke(jokeId);
        setJoke(jokeData);
        setSetup(jokeData.setup);
        setPunchline(jokeData.punchline);
        setError(null);
      } catch (err) {
        setError('Failed to load joke. Please try again.');
        console.error('Error loading joke:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jokeId) {
      loadJoke();
    }
  }, [jokeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!setup.trim() || !punchline.trim()) {
      setError('Both setup and punchline are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const jokeInput: JokeInput = {
        setup: setup.trim(),
        punchline: punchline.trim(),
      };

      await apiClient.updateJoke(jokeId, jokeInput);
      setSuccess(true);
      
      // Redirect back to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError('Failed to update joke. Please try again.');
      console.error('Error updating joke:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-700">Loading joke...</div>
        </div>
      </div>
    );
  }

  if (!joke && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Joke Not Found</h2>
          <p className="text-gray-700 mb-4">The joke you&apos;re trying to edit doesn&apos;t exist.</p>
          <Link 
            href="/" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            ✏️ Edit Joke
          </h1>
          <Link 
            href="/"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </header>

        {/* Edit Form */}
        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {success ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Joke Updated Successfully!
                </h2>
                <p className="text-gray-600">Redirecting you back...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label 
                    htmlFor="setup" 
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Setup
                  </label>
                  <textarea
                    id="setup"
                    value={setup}
                    onChange={(e) => setSetup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter the joke setup..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label 
                    htmlFor="punchline" 
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Punchline
                  </label>
                  <textarea
                    id="punchline"
                    value={punchline}
                    onChange={(e) => setPunchline(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter the punchline..."
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Updating...' : 'Update Joke'}
                  </button>
                  <Link
                    href="/"
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Preview */}
          {!success && joke && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Preview
              </h3>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="mb-4">
                  <div className="text-gray-800 text-lg leading-relaxed mb-2">
                    {setup || <span className="text-gray-400 italic">Setup preview...</span>}
                  </div>
                  <div className="text-gray-700 text-lg leading-relaxed font-semibold italic">
                    {punchline || <span className="text-gray-400 italic">Punchline preview...</span>}
                  </div>
                </div>
                <div className="flex justify-end items-center text-sm text-gray-500">
                  <span>ID: {joke._id}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
