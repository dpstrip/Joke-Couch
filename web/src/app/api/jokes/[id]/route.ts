// SOLID: Single Responsibility Principle (SRP)
// This route handler has one responsibility: proxying individual joke requests to the backend API

import { NextRequest, NextResponse } from 'next/server';

// SOLID: Open/Closed Principle (OCP)
// Configuration is open for extension through environment variables
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// SOLID: Single Responsibility Principle (SRP)
// Each function handles one HTTP method for a specific resource
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/jokes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
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
    console.error('Error updating joke:', error);
    return NextResponse.json(
      { error: 'Failed to update joke' },
      { status: 500 }
    );
  }
}