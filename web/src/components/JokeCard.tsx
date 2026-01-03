import React from 'react';
import { Joke } from '@/types/joke';

interface JokeCardProps {
  joke: Joke;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-lg mx-auto border-l-4 border-blue-500">
      <div className="text-gray-800 text-lg leading-relaxed mb-4">
        {joke.joke}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>ID: {joke._id}</span>
        <span>{new Date(joke.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};