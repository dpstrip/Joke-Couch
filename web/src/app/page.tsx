'use client';

import React, { useState } from 'react';
import { RandomJoke } from '@/components/RandomJoke';
import { AddJokeForm } from '@/components/AddJokeForm';
import { JokeList } from '@/components/JokeList';

type Tab = 'random' | 'all' | 'add';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('random');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJokeAdded = () => {
    // Force refresh of the joke list by changing key
    setRefreshKey(prev => prev + 1);
    // Optionally switch to the "all" tab to see the new joke
    setActiveTab('all');
  };

  const tabs = [
    { id: 'random' as Tab, label: 'Random Joke', icon: '🎲' },
    { id: 'all' as Tab, label: 'All Jokes', icon: '📋' },
    { id: 'add' as Tab, label: 'Add Joke', icon: '➕' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            🛋️ Joke Couch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the coziest place on the web to share and enjoy jokes! 
            Sit back, relax, and let the laughter begin.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {activeTab === 'random' && <RandomJoke />}
          {activeTab === 'all' && <JokeList key={refreshKey} />}
          {activeTab === 'add' && <AddJokeForm onJokeAdded={handleJokeAdded} />}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built with ❤️ using Next.js, React, and CouchDB
          </p>
        </footer>
      </div>
    </div>
  );
}