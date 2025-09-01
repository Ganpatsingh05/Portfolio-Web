'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Sphere */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Orbiting Boxes */}
      <Box args={[0.3, 0.3, 0.3]} position={[1.5, 0, 0]}>
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.6}
          roughness={0.4}
        />
      </Box>
      
      <Box args={[0.25, 0.25, 0.25]} position={[-1.2, 0.8, 0]}>
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      
      {/* Torus Ring */}
      <Torus args={[1, 0.1, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#10b981"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </Torus>
    </group>
  )
}

interface GeometricShapeProps {
  className?: string
}

export default function GeometricShape({ className = "w-full h-96" }: GeometricShapeProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        <FloatingGeometry />
      </Canvas>
    </div>
  )
}
