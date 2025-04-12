import { NextResponse } from 'next/server';

// Admin password (in production, store this in environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { password } = body;
    
    // Check if password matches
    const isValid = password === ADMIN_PASSWORD;
    
    // Return response
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}