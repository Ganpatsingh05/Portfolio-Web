import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Fetching personal info...')
    
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .single()

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log('Personal info fetched successfully:', data)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal info', details: error },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('personal_info')
      .update(body)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating personal info:', error)
    return NextResponse.json(
      { error: 'Failed to update personal info' },
      { status: 500 }
    )
  }
}
