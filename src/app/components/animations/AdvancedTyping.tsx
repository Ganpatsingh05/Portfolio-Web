'use client'

import { TypeAnimation } from 'react-type-animation'

interface AdvancedTypingProps {
  className?: string
}

export default function AdvancedTyping({ className = "text-4xl md:text-6xl font-bold" }: AdvancedTypingProps) {
  return (
    <TypeAnimation
      sequence={[
        'Full Stack Developer',
        2000,
        'AI Enthusiast',
        2000,
        'Data Scientist',
        2000,
        'Problem Solver',
        2000,
        'Tech Innovator',
        2000,
      ]}
      wrapper="span"
      speed={50}
      className={className}
      repeat={Infinity}
      cursor={true}
      preRenderFirstString={true}
    />
  )
}
