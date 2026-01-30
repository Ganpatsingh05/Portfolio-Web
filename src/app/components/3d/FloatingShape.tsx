'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

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
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function CSSFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="w-full h-full relative flex items-center justify-center">
        <div className="absolute w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse" />
        <div className="absolute w-48 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-30 animate-bounce" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full opacity-40 animate-pulse" 
             style={{ animationDelay: '1s' }} />
      </div>
    </div>
  )
}

interface FloatingShapeProps {
  className?: string
}

export default function FloatingShape({ className = "w-96 h-96" }: FloatingShapeProps) {
  const [shouldRender3D, setShouldRender3D] = useState(false)

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    // Only render 3D on desktop with WebGL
    const hasWebGL = !!gl
    const isDesktop = window.innerWidth >= 1024
    
    setShouldRender3D(hasWebGL && isDesktop)
  }, [])

  if (!shouldRender3D) {
    return <CSSFallback className={className} />
  }

  return (
    <div className={className}>
      <Suspense fallback={<CSSFallback className={className} />}>
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "default"
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
        </Canvas>
      </Suspense>
    </div>
  )
}
