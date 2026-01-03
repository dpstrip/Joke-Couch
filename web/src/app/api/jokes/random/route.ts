import { NextResponse } from 'next/server';

// Use localhost for builds, joke-couch-api for Docker runtime
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET() {
  console.log('Random joke API route called');
  try {
    console.log(`Fetching from: ${API_BASE_URL}/jokes/random`);
    const response = await fetch(`${API_BASE_URL}/jokes/random`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched random joke:', data._id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching random joke:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random joke' }, 
      { status: 500 }
    );
  }
}