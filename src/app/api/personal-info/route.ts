import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/personal-info`, {
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
    console.error('Error fetching personal info data:', error);
    
    // Return fallback data
    return NextResponse.json({
      data: {
        name: 'Ganpat Singh',
        title: 'Full Stack Developer & AI Enthusiast',
        email: 'ask.gsinghr@gmail.com',
        location: 'Jodhpur, Rajasthan (India)',
        github_url: 'https://github.com/Ganpatsingh05',
        linkedin_url: 'https://linkedin.com/in/ganpatsingh05',
        bio: 'Passionate full-stack developer with expertise in modern web technologies and AI.',
        resume_url: '',
        avatar_url: ''
      }
    }, { status: 200 });
  }
}