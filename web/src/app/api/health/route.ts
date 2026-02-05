// SOLID: Single Responsibility Principle (SRP)
// This route handler has one responsibility: proxying health check requests to the backend API

import { NextResponse } from 'next/server';

// SOLID: Open/Closed Principle (OCP)
// Configuration is open for extension through environment variables
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// SOLID: Single Responsibility Principle (SRP)
// This function handles one specific operation: health check
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