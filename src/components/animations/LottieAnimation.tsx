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
      // Load default animations from CDN as fallback
      const loadAnimation = async () => {
        try {
          const animations = {
            coding: 'https://lottie.host/1c5f90e6-8064-4a7b-9c5c-2c8e5b3a4f72/qJp7BdKWWC.json',
            rocket: 'https://lottie.host/87c55b98-bc5a-4a99-9e5f-7d6c3b4a5e8f/rKm9NfLxXD.json',
            ai: 'https://lottie.host/4a2d9e78-bc4a-4f7b-8e2c-1c5f7b9a3e6d/sLn8MgKyYE.json',
            data: 'https://lottie.host/9e5c3a7f-bc7a-4d8b-9f6e-3c8f5b2a7e9d/tPm2NgLzZF.json',
            web: 'https://lottie.host/6f8e2c4a-bc9a-4e7b-8d5c-4f7b3a9e2c6d/uQn4OhMaAG.json',
            mobile: 'https://lottie.host/3c7b5e8f-bc2a-4f9b-8e7c-7b3f6a4e9c2d/vRo5PiNbBH.json'
          }
          
          const response = await fetch(animations[fallbackAnimation as keyof typeof animations] || animations.coding)
          const data = await response.json()
          setAnimation(data)
        } catch (error) {
          console.log('Failed to load Lottie animation:', error)
          // Fallback to local animations if CDN fails
          try {
            const localAnimations = {
              coding: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json',
              rocket: 'https://assets4.lottiefiles.com/packages/lf20_5tl1xxnz.json',
              ai: 'https://assets9.lottiefiles.com/packages/lf20_fcfjwiyb.json',
              data: 'https://assets5.lottiefiles.com/packages/lf20_qp1q7mct.json',
              web: 'https://assets1.lottiefiles.com/packages/lf20_v9riyrde.json',
              mobile: 'https://assets3.lottiefiles.com/packages/lf20_dews3j6m.json'
            }
            
            const fallbackResponse = await fetch(localAnimations[fallbackAnimation as keyof typeof localAnimations] || localAnimations.coding)
            const fallbackData = await fallbackResponse.json()
            setAnimation(fallbackData)
          } catch (fallbackError) {
            console.log('Failed to load fallback animation:', fallbackError)
          }
        }
      }
      
      loadAnimation()
    }
  }, [animationData, fallbackAnimation])

  if (!animation) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg`}>
        <div className="animate-pulse text-blue-600 dark:text-blue-400">
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
