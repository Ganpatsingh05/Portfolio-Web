"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState, Suspense } from 'react'
import { api } from '@/lib/api'
import { useTheme } from '@/app/components/ui/ThemeProvider'

// Static imports for critical UI
import Navigation from '@/app/components/ui/Navigation'

// Dynamic imports for heavy components (loaded after initial render)
const ResponsiveLayout = dynamic(() => import('@/app/components/layout/ResponsiveLayout'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading content...</div>
    </div>
  ),
  ssr: true, // Enable SSR for better SEO
})

const AOSInit = dynamic(() => import('@/app/components/animations/AOSInit'), {
  ssr: false, // Animation library doesn't need SSR
})

interface SiteSettings {
  maintenance_mode: boolean
  show_navigation: boolean
  enable_animations: boolean
  default_theme: 'light' | 'dark' | 'system'
  accent_color: string
}

export default function Home() {
  const { applyThemeFromSettings } = useTheme()
  const [settings, setSettings] = useState<SiteSettings>({
    maintenance_mode: false,
    show_navigation: true,
    enable_animations: true,
    default_theme: 'system',
    accent_color: '#3B82F6',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Defer settings fetch to not block initial render
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings()
        setSettings({
          maintenance_mode: data.maintenance_mode ?? false,
          show_navigation: data.show_navigation ?? true,
          enable_animations: data.enable_animations ?? true,
          default_theme: data.default_theme ?? 'system',
          accent_color: data.accent_color ?? '#3B82F6',
        })
        
        // Apply theme from settings
        applyThemeFromSettings(
          data.default_theme ?? 'system',
          data.accent_color ?? '#3B82F6'
        )
      } catch (error) {
        // Log error but don't break the page - use default settings
        console.warn('Failed to fetch settings, using defaults:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Use requestIdleCallback to defer non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => fetchSettings(), { timeout: 2000 })
    } else {
      setTimeout(fetchSettings, 0)
    }
    
    // Track page view asynchronously
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        api.trackEvent('page_view', { path: window.location.pathname })
      })
    } else {
      setTimeout(() => {
        api.trackEvent('page_view', { path: window.location.pathname })
      }, 100)
    }
  }, [applyThemeFromSettings])

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Show static navigation immediately */}
      {settings.show_navigation && !settings.maintenance_mode && <Navigation />}
      
      {/* Load animations conditionally and defer */}
      {settings.enable_animations && <AOSInit />}
      
      {/* Main content with suspense boundary */}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      }>
        <ResponsiveLayout />
      </Suspense>
    </main>
  )
}
