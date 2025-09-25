'use client'

import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'

interface LottieAnimationProps {
  animationData?: any
  fallbackAnimation?: string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export default function LottieAnimation({ 
  animationData, 
  fallbackAnimation = 'coding',
  className = "w-64 h-64",
  loop = true,
  autoplay = true 
}: LottieAnimationProps) {
  const [animation, setAnimation] = useState(null)

  useEffect(() => {
    if (animationData) {
      setAnimation(animationData)
    } else {
      // Load default animations from reliable CDN sources
      const loadAnimation = async () => {
        try {
          // Using reliable Lottie animation URLs from lottiefiles.com
          const animations = {
            coding: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json',
            rocket: 'https://assets4.lottiefiles.com/packages/lf20_5tl1xxnz.json',
            ai: 'https://assets9.lottiefiles.com/packages/lf20_fcfjwiyb.json',
            data: 'https://assets5.lottiefiles.com/packages/lf20_qp1q7mct.json',
            web: 'https://assets1.lottiefiles.com/packages/lf20_v9riyrde.json',
            mobile: 'https://assets3.lottiefiles.com/packages/lf20_dews3j6m.json'
          }
          
          const response = await fetch(animations[fallbackAnimation as keyof typeof animations] || animations.coding)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const data = await response.json()
          setAnimation(data)
        } catch (error) {
          console.log('Animation loading failed:', error)
          // Graceful fallback - just show a simple animated placeholder
          setAnimation(null)
        }
      }
      
      loadAnimation()
    }
  }, [animationData, fallbackAnimation])

  if (!animation) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg`}>
        <div className="animate-pulse text-orange-500">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L13 9H20L14 14.5L16 22L10 18L4 22L6 14.5L0 9H7L10 2Z"/>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Lottie 
        animationData={animation} 
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  )
}
