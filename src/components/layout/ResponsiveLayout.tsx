'use client'

import { useState, useEffect } from 'react'

// Desktop Components
import Hero from '../sections/Hero'
import About from '../sections/About'
import Projects from '../sections/Projects'
import Experience from '../sections/Experience'
import Skills from '../sections/Skills'
import Contact from '../sections/Contact'

// Mobile Components
import MobileHero from '../sections/MobileHero'
import MobileAbout from '../sections/MobileAbout'

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
      
      {children}
    </div>
  )
}
