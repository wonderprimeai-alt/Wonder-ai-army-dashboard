import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from the dashboard backend
    const response = await fetch('http://localhost:8080/api/status');
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
