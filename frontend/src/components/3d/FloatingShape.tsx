'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { shouldUse3D } from '@/utils/webgl'

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 128]} scale={2.5}>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function FallbackComponent({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="w-full h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse" />
        <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-30 animate-bounce" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute inset-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full opacity-40 animate-pulse" 
             style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}

interface FloatingShapeProps {
  className?: string
}

export default function FloatingShape({ className = "w-96 h-96" }: FloatingShapeProps) {
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
        setHasError(true)
        setIsInitialized(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Show loading state during initialization
  if (!isInitialized) {
    return <FallbackComponent className={className} />
  }

  // Fallback to CSS animation if WebGL not supported, on mobile, or error occurred
  if (!use3D || hasError) {
    return <FallbackComponent className={className} />
  }

  // Only try to render Canvas if we're confident it will work
  try {
    return (
      <div className={className}>
        <Canvas
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
          performance={{ min: 0.5 }}
          gl={{
            antialias: false,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: true
          }}
          onCreated={({ gl }) => {
            try {
              // Handle WebGL context loss
              const canvas = gl.domElement
              canvas.addEventListener('webglcontextlost', (event) => {
                event.preventDefault()
                console.warn('WebGL context lost in FloatingShape')
                setHasError(true)
              })
              
              canvas.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored in FloatingShape')
                setHasError(false)
              })
              
              if (gl.debug) {
                gl.debug.checkShaderErrors = false
              }
            } catch (error) {
              console.warn('Error setting up WebGL context:', error)
              setHasError(true)
            }
          }}
          onError={(error) => {
            console.warn('Three.js error in FloatingShape:', error)
            setHasError(true)
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <AnimatedSphere />
          </Suspense>
        </Canvas>
      </div>
    )
  } catch (error) {
    // Silently catch any Canvas creation errors and return fallback
    console.warn('Canvas creation failed, using fallback:', error)
    setHasError(true)
    return <FallbackComponent className={className} />
  }
}
