"use client"

import Navigation from '@/components/ui/Navigation'
import ResponsiveLayout from '@/components/layout/ResponsiveLayout'
import AOSInit from '@/components/animations/AOSInit'
import { useEffect } from 'react'

function PageViewTracker() {
  useEffect(() => {
    const send = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'page_view',
            event_data: { path: window.location.pathname }
          })
        })
      } catch (e) {
        // no-op
      }
    }
    send()
  }, [])
  return null
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
  <PageViewTracker />
      <AOSInit />
      <Navigation />
      <ResponsiveLayout />
    </main>
  )
}
