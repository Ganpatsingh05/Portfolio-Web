'use client'

import { TypeAnimation } from 'react-type-animation'

interface AdvancedTypingProps {
  className?: string
  texts?: string[]
}

export default function AdvancedTyping({ 
  className = "text-4xl md:text-6xl font-bold",
  texts = ['Full Stack Developer', 'AI Enthusiast', 'Data Scientist', 'Problem Solver', 'Tech Innovator']
}: AdvancedTypingProps) {
  // Ensure we always have texts to display
  const textsToUse = texts && texts.length > 0 ? texts : ['Full Stack Developer', 'AI Enthusiast', 'Data Scientist', 'Problem Solver', 'Tech Innovator'];
  
  // Create sequence array for TypeAnimation
  const sequence = textsToUse.flatMap(text => [text, 2000]);

  return (
    <TypeAnimation
      sequence={sequence}
      wrapper="span"
      speed={50}
      className={className}
      repeat={Infinity}
      cursor={true}
      preRenderFirstString={true}
    />
  )
}
