import React from 'react';
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
      <div className="flex justify-end items-center text-sm text-gray-500">
        <span>ID: {joke._id}</span>
      </div>
    </div>
  );
};