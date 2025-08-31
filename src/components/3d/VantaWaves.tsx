'use client'

import { useEffect, useState } from 'react'
import { shouldUse3D } from '@/utils/webgl'

interface VantaWavesProps {
  children: React.ReactNode
  className?: string
}

export default function VantaWaves({ children, className = "min-h-screen" }: VantaWavesProps) {
  const [use3D, setUse3D] = useState(false)

  useEffect(() => {
    setUse3D(shouldUse3D())
  }, [])

  useEffect(() => {
    // Only load Vanta on devices that support 3D
    if (!use3D) return

    let vantaEffect: any = null

    const loadVanta = async () => {
      try {
        if (typeof window !== 'undefined') {
          const VANTA = (await import('vanta/dist/vanta.waves.min.js')).default
          const THREE = await import('three')
          
          vantaEffect = VANTA({
            el: "#vanta-waves",
            THREE: THREE,
            mouseControls: true,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 0.50,
            color: 0x3b82f6,
            shininess: 20.00,
            waveHeight: 15.00,
            waveSpeed: 0.30,
            zoom: 0.75
          })
        }
      } catch (error) {
        console.warn('Failed to load Vanta waves:', error)
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy()
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error)
        }
      }
    }
  }, [use3D])

  return (
    <div 
      id="vanta-waves" 
      className={`${className} ${!use3D ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900' : ''}`}
    >
      {children}
    </div>
  )
}
