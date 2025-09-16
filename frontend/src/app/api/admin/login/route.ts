// Temporary proxy for admin login when backend is not deployed
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Hardcoded authentication for now (TEMPORARY SOLUTION)
    // Replace this with proper authentication once backend is deployed
    if (username === 'admin' && password === 'GanpatPortfolio2024!') {
      // Create a simple JWT-like token for the frontend
      const token = Buffer.from(JSON.stringify({
        user: 'admin',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        iat: Math.floor(Date.now() / 1000)
      })).toString('base64');
      
      return NextResponse.json({
        token: `temp.${token}.temp`,
        user: { username: 'admin' },
        message: 'Login successful'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}