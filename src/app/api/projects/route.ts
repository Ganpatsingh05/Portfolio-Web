import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/projects`, {
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
    console.error('Error fetching projects data:', error);
    
    // Return fallback data
    return NextResponse.json({
      data: [
        {
          id: 1,
          title: 'AI-Powered Portfolio',
          description: 'An intelligent portfolio website built with Next.js and AI',
          technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
          status: 'active',
          featured: true,
          category: 'Web Development',
          github_url: 'https://github.com/Ganpatsingh05',
          live_url: '',
          image_url: '',
          start_date: '2024-01-01',
          end_date: null
        }
      ]
    }, { status: 200 });
  }
}