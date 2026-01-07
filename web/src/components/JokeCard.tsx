import React from 'react';
import Link from 'next/link';
import { Joke } from '@/types/joke';

interface JokeCardProps {
  joke: Joke;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-lg mx-auto border-l-4 border-blue-500">
      <div className="mb-4">
        <div className="text-gray-800 text-lg leading-relaxed mb-2">
          {joke.setup}
        </div>
        <div className="text-gray-700 text-lg leading-relaxed font-semibold italic">
          {joke.punchline}
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <Link 
          href={`/edit/${joke._id}`}
          className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          ✏️ Update
        </Link>
        <span>ID: {joke._id}</span>
      </div>
    </div>
  );
};