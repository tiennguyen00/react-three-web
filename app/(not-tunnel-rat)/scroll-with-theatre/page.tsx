'use client'

import { cameraMovementSheet, initTheatreStudio } from '@/animation/theatre'
import Fog from '@/components/scroll-with-theatre/Fog'
import Ground from '@/components/scroll-with-theatre/Ground'
import House from '@/components/scroll-with-theatre/House'
import Light from '@/components/scroll-with-theatre/Light'
import CameraControlTheatre from '@/utils/CameraControlTheatre'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { SheetProvider } from '@theatre/r3f'
import { Suspense } from 'react'
import * as THREE from 'three'

const Page = () => {
  return (
    <Canvas
      id='canvas-custom'
      style={{
        position: 'fixed',
        overflow: 'auto',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        // pointerEvents: 'none',
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
    >
      <color args={[new THREE.Color().setHSL(0.6, 0, 1)]} attach='background' />
      {/* <SheetProvider sheet={cameraMovementSheet}> */}
      <Suspense fallback={null}>
        {/* <CameraControlTheatre /> */}
        <Ground />
        <Fog />
        <Light />
        <House
          props={{
            scale: 8,
            rotation: [0, Math.PI * 0.5, 0],
          }}
        />
      </Suspense>
      {/* </SheetProvider> */}
      <OrbitControls />
    </Canvas>
  )
}

export default Page
