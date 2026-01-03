import React from 'react';
import { Joke } from '@/types/joke';

interface JokeCardProps {
  joke: Joke;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
  };

  // Support both joke formats: single 'joke' field or 'setup'/'punchline' fields
  const renderJokeContent = () => {
    if (joke.setup && joke.punchline) {
      return (
        <>
          <div className="text-gray-800 text-lg leading-relaxed mb-2">
            {joke.setup}
          </div>
          <div className="text-gray-700 text-lg leading-relaxed font-semibold italic">
            {joke.punchline}
          </div>
        </>
      );
    }
    return (
      <div className="text-gray-800 text-lg leading-relaxed">
        {joke.joke}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-lg mx-auto border-l-4 border-blue-500">
      <div className="mb-4">
        {renderJokeContent()}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>ID: {joke._id}</span>
        <span>{formatDate(joke.createdAt)}</span>
      </div>
    </div>
  );
};