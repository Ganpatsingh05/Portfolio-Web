"use client"

import Navigation from '@/app/components/ui/Navigation'
import ResponsiveLayout from '@/app/components/layout/ResponsiveLayout'
import AOSInit from '@/app/components/animations/AOSInit'
import { useEffect } from 'react'
import { api } from '@/lib/api'

function PageViewTracker() {
  useEffect(() => {
    api.trackEvent('page_view', { path: window.location.pathname })
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
