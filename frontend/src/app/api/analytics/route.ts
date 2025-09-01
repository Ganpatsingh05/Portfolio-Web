import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, event_data } = body

    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    // Insert analytics event
    const { data, error } = await supabase
      .from('analytics')
      .insert({
        event_type,
        event_data,
        ip_address: ip,
        user_agent: userAgent,
        referrer
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error logging analytics:', error)
    return NextResponse.json(
      { error: 'Failed to log analytics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get analytics summary
    const { data: totalViews, error: viewsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('event_type', 'page_view')

    const { data: projectClicks, error: clicksError } = await supabase
      .from('analytics')
      .select('*')
      .eq('event_type', 'project_click')

    const { data: resumeDownloads, error: downloadsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('event_type', 'resume_download')

    if (viewsError || clicksError || downloadsError) {
      throw new Error('Failed to fetch analytics')
    }

    const analytics = {
      totalViews: totalViews?.length || 0,
      projectClicks: projectClicks?.length || 0,
      resumeDownloads: resumeDownloads?.length || 0,
      recentActivity: totalViews?.slice(0, 10) || []
    }

    return NextResponse.json({ data: analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
