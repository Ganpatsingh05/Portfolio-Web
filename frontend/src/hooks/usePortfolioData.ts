import { useState, useEffect } from 'react'

// Types for our data
export interface PersonalInfo {
  id: string
  name: string
  title: string
  email: string
  location: string
  github_url?: string
  linkedin_url?: string
  leetcode_url?: string
  resume_url?: string
  bio?: string
  journey?: string
  degree?: string
  university?: string
  education_period?: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  category: string
  github_url?: string
  demo_url?: string
  technologies: string[]
  featured: boolean
  sort_order: number
  status: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon_name?: string
  sort_order: number
  is_featured: boolean
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string[]
  type: string
  location?: string
  company_url?: string
  sort_order: number
  is_current: boolean
}

// Custom hooks for data fetching
export function usePersonalInfo() {
  const [data, setData] = useState<PersonalInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/personal-info')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error, setData }
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/skills')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useExperiences() {
  const [data, setData] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/experiences')
        if (!response.ok) throw new Error('Failed to fetch')
        const result = await response.json()
        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// Analytics helper
export async function trackEvent(eventType: string, eventData?: any) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        event_data: eventData,
      }),
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}
