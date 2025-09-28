import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/experiences`, {
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
    console.error('Error fetching experiences data:', error);
    
    // Return fallback data
    return NextResponse.json({
      data: [
        {
          id: 1,
          company: 'Self-Employed',
          position: 'Full Stack Developer',
          start_date: '2022-01-01',
          end_date: null,
          current: true,
          description: 'Working on various web development projects using modern technologies.',
          location: 'Remote',
          skills: ['JavaScript', 'React', 'Node.js', 'Python']
        }
      ]
    }, { status: 200 });
  }
}