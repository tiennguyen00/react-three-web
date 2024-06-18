'use client'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/patterns/patterns.vert'
import fragment from '@/components/shared/patterns/patterns.frag'

const Test = () => {
  return (
    <mesh>
      <planeGeometry args={[1, 1, 8, 8]} />
      <shaderMaterial side={THREE.DoubleSide} vertexShader={vertex} fragmentShader={fragment} />
    </mesh>
  )
}

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
        position: [0, 0, 1],
      }}
    >
      <color args={['#FEFEE8']} attach='background' />
      {/* <axesHelper /> */}
      <Test />
      <OrbitControls />
    </Canvas>
  )
}

export default page
