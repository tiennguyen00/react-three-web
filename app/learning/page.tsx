import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'

const Learning = () => {
  return (
    <Canvas
      className='h-full w-full'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
    >
      <axesHelper />

      <OrbitControls />
    </Canvas>
  )
}

export default Learning
