'use client'

import { useState, useEffect } from 'react'
import { api } from '@/app/lib/api'
import { apiEndpoints } from '@/app/lib/config'

// Desktop Components
import Hero from '../sections/Hero'
import About from '../sections/About'
import Projects from '../sections/Projects'
import Experience from '../sections/Experience'
import Skills from '../sections/Skills'
import Contact from '../sections/Contact'
import Footer from '../ui/Footer'

// Mobile Components
import MobileHero from '../mobile/MobileHero'
import MobileAbout from '../mobile/MobileAbout'

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
}

const defaultSettings: SiteSettings = {
  maintenance_mode: false,
  maintenance_message: 'Site is under maintenance. Please check back soon.',
  visible_sections: ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
  show_footer: true,
  show_navigation: true,
  enable_animations: true,
  contact_form_enabled: true,
  show_social_links: true,
  show_resume_button: true,
}

interface ResponsiveLayoutProps {
  children?: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings()
        setSettings({
          ...defaultSettings,
          ...data,
        })
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        // Use defaults on error
      } finally {
        setSettingsLoaded(true)
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Track page view analytics
  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch(apiEndpoints.analytics, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'page_view',
            event_data: { 
              page: 'portfolio',
              timestamp: new Date().toISOString(),
              viewport: isMobile ? 'mobile' : 'desktop'
            },
          }),
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    // Track page view when component mounts
    trackPageView()
  }, [isMobile])

  // Helper to check if a section is visible
  const isVisible = (section: string) => settings.visible_sections.includes(section)

  // Show loading state while settings load
  if (!settingsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show maintenance page if enabled
  if (settings.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10"
              style={{
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
                animationDelay: `-${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="text-center p-8 max-w-lg relative z-10">
          {/* Animated gears */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            {/* Large gear */}
            <svg 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 text-blue-400 animate-spin-slow"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
            
            {/* Small gear 1 */}
            <svg 
              className="absolute bottom-2 left-4 w-16 h-16 text-cyan-400 animate-spin-reverse"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
            
            {/* Small gear 2 */}
            <svg 
              className="absolute bottom-4 right-4 w-12 h-12 text-indigo-400 animate-spin-slow"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>

            {/* Wrench icon */}
            <svg 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-400 animate-bounce-slow"
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>

          {/* Text content */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Under Maintenance
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-6 rounded-full" />
          <p className="text-gray-300 text-lg md:text-xl mb-8 animate-fade-in-delay">
            {settings.maintenance_message}
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm ml-2">Working on it</span>
          </div>
        </div>

        {/* Custom styles for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translate(-50%, -50%) rotate(-15deg); }
            50% { transform: translate(-50%, -60%) rotate(15deg); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 6s linear infinite;
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
          }
          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.2s forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section - Mobile vs Desktop */}
      {isVisible('hero') && (isMobile ? <MobileHero /> : <Hero />)}
      
      {/* About Section - Mobile vs Desktop */}
      {isVisible('about') && (isMobile ? <MobileAbout /> : <About />)}
      
      {/* Shared Components - Same for both mobile and desktop */}
      {isVisible('projects') && <Projects />}
      {isVisible('experience') && <Experience />}
      {isVisible('skills') && <Skills />}
      {isVisible('contact') && <Contact />}
      
      {/* Footer - Same for both mobile and desktop */}
      {settings.show_footer && <Footer />}
      
      {children}
    </div>
  )
}
