"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState, Suspense } from 'react'
import { api } from '@/lib/api'
import { useTheme } from '@/app/components/ui/ThemeProvider'
import { useGlobalLoading } from '@/app/components/ui/GlobalLoadingProvider'

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

interface SiteSettings {
  maintenance_mode: boolean
  maintenance_message: string
  visible_sections: string[]
  show_footer: boolean
  show_navigation: boolean
  enable_animations: boolean
  contact_form_enabled: boolean
  show_social_links: boolean
  show_resume_button: boolean
  default_theme: 'light' | 'dark' | 'system'
  accent_color: string
}

export default function Home() {
  const { applyThemeFromSettings } = useTheme()
  const { setIsLoading, setLoadingProgress } = useGlobalLoading()
  const [settings, setSettings] = useState<SiteSettings>({
    maintenance_mode: false,
    maintenance_message: 'Site is under maintenance. Please check back soon.',
    visible_sections: ['hero', 'about', 'skills', 'projects', 'experience', 'certificates', 'contact'],
    show_footer: true,
    show_navigation: true,
    enable_animations: true,
    contact_form_enabled: true,
    show_social_links: true,
    show_resume_button: true,
    default_theme: 'system',
    accent_color: '#3B82F6',
  })

  useEffect(() => {
    let showLoaderTimer: ReturnType<typeof setTimeout> | null = null
    let done = false

    const initializeApp = async () => {
      // Only show the loader if data takes longer than 1s to arrive
      showLoaderTimer = setTimeout(() => {
        if (!done) {
          setIsLoading(true)
          setLoadingProgress(15)
        }
      }, 1000)

      try {
        const [data, _hero] = await Promise.all([
          api.getSettings().then(d => { if (!done) setLoadingProgress(50); return d }),
          api.getHero().then(h => { if (!done) setLoadingProgress(75); return h }),
        ])

        setSettings({
          maintenance_mode: data.maintenance_mode ?? false,
          maintenance_message: data.maintenance_message ?? 'Site is under maintenance. Please check back soon.',
          visible_sections: data.visible_sections ?? ['hero', 'about', 'skills', 'projects', 'experience', 'certificates', 'contact'],
          show_footer: data.show_footer ?? true,
          show_navigation: data.show_navigation ?? true,
          enable_animations: data.enable_animations ?? true,
          contact_form_enabled: data.contact_form_enabled ?? true,
          show_social_links: data.show_social_links ?? true,
          show_resume_button: data.show_resume_button ?? true,
          default_theme: data.default_theme ?? 'system',
          accent_color: data.accent_color ?? '#3B82F6',
        })

        applyThemeFromSettings(
          data.default_theme ?? 'system',
          data.accent_color ?? '#3B82F6'
        )
      } catch (error) {
        console.warn('Failed to fetch initial data, using defaults:', error)
      } finally {
        done = true
        if (showLoaderTimer) clearTimeout(showLoaderTimer)
        setLoadingProgress(100)
        setIsLoading(false)
      }
    }

    initializeApp()

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
  }, [applyThemeFromSettings, setIsLoading, setLoadingProgress])

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Keep navigation outside scaled layer so fixed header remains sticky/fixed */}
      {settings.show_navigation && !settings.maintenance_mode && <Navigation />}

      <div className="home-zoom-layer">
        {/* Main content with suspense boundary */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        }>
          <ResponsiveLayout initialSettings={settings} />
        </Suspense>
      </div>
    </main>
  )
}
