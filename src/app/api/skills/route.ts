import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/skills`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching skills data:', error);
    
    // Return fallback data
    return NextResponse.json({
      data: [
        {
          id: 1,
          name: 'JavaScript',
          category: 'Frontend',
          level: 90,
          icon_url: '',
          years_experience: 3
        },
        {
          id: 2,
          name: 'React',
          category: 'Frontend',
          level: 85,
          icon_url: '',
          years_experience: 2
        },
        {
          id: 3,
          name: 'Node.js',
          category: 'Backend',
          level: 80,
          icon_url: '',
          years_experience: 2
        }
      ]
    }, { status: 200 });
  }
}