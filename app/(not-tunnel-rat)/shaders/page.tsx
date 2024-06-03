'use client'
import Plane from '@/components/shaders/plane'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

const page = () => {
  return (
    <Canvas
      id='canvas-custom'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [0, 0, 5],
      }}
    >
      <color args={['#FEFEE8']} attach='background' />
      <axesHelper />
      <Plane />
      <OrbitControls />
    </Canvas>
  )
}

export default page
