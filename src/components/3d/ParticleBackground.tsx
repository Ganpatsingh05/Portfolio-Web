'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { shouldUse3D } from '@/utils/webgl'

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  
  const particlesPosition = useMemo(() => {
    // Reduce particle count for better performance
    const positions = new Float32Array(1000 * 3)
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.03
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export default function ParticleBackground() {
  const [use3D, setUse3D] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Delay WebGL detection to ensure proper initialization
    const timer = setTimeout(() => {
      try {
        const should3D = shouldUse3D()
        setUse3D(should3D)
        setIsInitialized(true)
      } catch (error) {
        console.warn('WebGL detection failed:', error)
        setUse3D(false)
        setIsInitialized(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Show minimal loading state during initialization
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Fallback to CSS animation if WebGL not supported, on mobile, or error occurred
  if (!use3D || hasError) {
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-20">
          {/* CSS-based particle effect as fallback */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 1] }}
          style={{ background: 'transparent' }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)} // Limit DPR to avoid performance issues
          performance={{ min: 0.5 }}
          gl={{
            antialias: false, // Disable antialiasing to improve performance
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: true // Fail gracefully on low-end devices
          }}
          onCreated={({ gl }) => {
            try {
              // Handle WebGL context loss
              const canvas = gl.domElement
              canvas.addEventListener('webglcontextlost', (event) => {
                event.preventDefault()
                console.warn('WebGL context lost')
                setHasError(true)
              })
              
              canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored')
                setHasError(false)
              })
              
              // Suppress debug warnings
              if (gl.debug) {
                gl.debug.checkShaderErrors = false
              }
            } catch (error) {
              console.warn('Error setting up WebGL context:', error)
              setHasError(true)
            }
          }}
          onError={(error) => {
            console.warn('Three.js error:', error)
            setHasError(true)
          }}
        >
          <Particles />
        </Canvas>
      </div>
    )
  } catch (error) {
    console.warn('Canvas creation failed:', error)
    setHasError(true)
    
    // Return fallback immediately if Canvas creation fails
    return (
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
}
