import { NextRequest, NextResponse } from 'next/server';

// Use localhost for builds, joke-couch-api for Docker runtime
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/jokes`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jokes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jokes' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/jokes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating joke:', error);
    return NextResponse.json(
      { error: 'Failed to create joke' }, 
      { status: 500 }
    );
  }
}