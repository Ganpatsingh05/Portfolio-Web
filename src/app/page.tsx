"use client"

import Navigation from '@/app/components/ui/Navigation'
import ResponsiveLayout from '@/app/components/layout/ResponsiveLayout'
import AOSInit from '@/app/components/animations/AOSInit'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useTheme } from '@/app/components/ui/ThemeProvider'

interface SiteSettings {
  maintenance_mode: boolean
  show_navigation: boolean
  enable_animations: boolean
  default_theme: 'light' | 'dark' | 'system'
  accent_color: string
}

function PageViewTracker() {
  useEffect(() => {
    api.trackEvent('page_view', { path: window.location.pathname })
  }, [])
  return null
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

  useEffect(() => {
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
      }
    }
    fetchSettings()
  }, [applyThemeFromSettings])

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <PageViewTracker />
      {settings.enable_animations && <AOSInit />}
      {settings.show_navigation && !settings.maintenance_mode && <Navigation />}
      <ResponsiveLayout />
    </main>
  )
}
