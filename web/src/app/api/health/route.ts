import { NextResponse } from 'next/server';

// Use localhost for builds, joke-couch-api for Docker runtime
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking health:', error);
    return NextResponse.json(
      { error: 'Health check failed' }, 
      { status: 500 }
    );
  }
}