import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, event_data } = body

    // Get client info
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    // x-forwarded-for can be a list: "client, proxy1, proxy2" -> take first
    const firstIp = rawIp.split(',')[0]?.trim() || ''
    const isValidIp = (val: string) => {
      // Simple IPv4/IPv6 check
      const ipv4 = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/
      const ipv6 = /^[0-9a-fA-F:]+$/
      return ipv4.test(val) || (val.includes(':') && ipv6.test(val))
    }
    const ip = isValidIp(firstIp) ? firstIp : null
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    // Insert analytics event
    const { error } = await supabaseAdmin
      .from('analytics')
      .insert({
        event_type,
        event_data,
  ip_address: ip,
        user_agent: userAgent,
        referrer
      })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error logging analytics:', error)
    const isDev = process.env.NODE_ENV !== 'production'
    return NextResponse.json(
      isDev
        ? { error: 'Failed to log analytics', details: (error as any)?.message, code: (error as any)?.code }
        : { error: 'Failed to log analytics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get analytics summary
    const { data: totalViews, error: viewsError } = await supabaseAdmin
      .from('analytics')
      .select('*')
      .eq('event_type', 'page_view')

    const { data: projectClicks, error: clicksError } = await supabaseAdmin
      .from('analytics')
      .select('*')
      .eq('event_type', 'project_click')

    const { data: resumeDownloads, error: downloadsError } = await supabaseAdmin
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
