'use client'

import { useState, useEffect } from 'react'

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

interface ResponsiveLayoutProps {
  children?: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

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
        await fetch('/api/analytics', {
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

  return (
    <div>
      {/* Hero Section - Mobile vs Desktop */}
      {isMobile ? <MobileHero /> : <Hero />}
      
      {/* About Section - Mobile vs Desktop */}
      {isMobile ? <MobileAbout /> : <About />}
      
      {/* Shared Components - Same for both mobile and desktop */}
      <Projects />
      <Experience />
      <Skills />
      <Contact />
      
      {/* Footer - Same for both mobile and desktop */}
      <Footer />
      
      {children}
    </div>
  )
}
