import { NextRequest, NextResponse } from 'next/server';

// Use localhost for builds, joke-couch-api for Docker runtime
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/jokes/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Joke not found' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching joke:', error);
    return NextResponse.json(
      { error: 'Failed to fetch joke' },
      { status: 500 }
    );
  }
}