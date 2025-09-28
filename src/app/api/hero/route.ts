import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/hero`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle nested data structure from backend
    const rawData = data.data || data;
    
    // Ensure data has expected structure
    const sanitizedData = {
      name: rawData.name || 'Ganpat Singh',
      typing_texts: Array.isArray(rawData.typing_texts) ? rawData.typing_texts : 
                   ['Full Stack Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Innovator'],
      quote: rawData.quote || 'Creating amazing digital experiences with cutting-edge technology',
      social_links: rawData.social_links || {
        github: 'https://github.com/Ganpatsingh05',
        linkedin: 'https://www.linkedin.com/in/ganpat-singh-aabb4a285/',
        email: 'ask.gsinghr@gmail.com'
      }
    };
    
    return NextResponse.json(sanitizedData, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching hero data:', error);
    
    // Return fallback data
    return NextResponse.json({
      name: 'Ganpat Singh',
      typing_texts: [
        'Full Stack Developer',
        'AI Enthusiast',
        'Problem Solver',
        'Tech Innovator'
      ],
      quote: 'Creating amazing digital experiences with cutting-edge technology',
      social_links: {
        github: 'https://github.com/Ganpatsingh05',
        linkedin: 'https://www.linkedin.com/in/ganpat-singh-aabb4a285/',
        twitter: '',
        email: 'ask.gsinghr@gmail.com',
        instagram: '',
        website: ''
      }
    }, { status: 200 });
  }
}