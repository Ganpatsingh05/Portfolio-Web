import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Forward the request to the backend
    const backendFormData = new FormData()
    backendFormData.append('resume', file)

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/resume`, {
      method: 'POST',
      body: backendFormData
    })

    if (!backendResponse.ok) {
      throw new Error('Backend upload failed')
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error uploading resume:', error)
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 })
  }
}
