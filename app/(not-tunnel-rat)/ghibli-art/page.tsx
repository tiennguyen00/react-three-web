'use client'
import Control from '@/components/ghibli-art/Control'
import Experience from '@/components/ghibli-art/Experience'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

const Page = () => {
  return (
    <Canvas
      id='ghibli-art-canvas'
      className='fixed left-0 top-0 flex outline-none'
      camera={{
        position: new THREE.Vector3(-7, 3, 7),
      }}
      gl={{
        // powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
      }}
    >
      <color attach='background' args={['#4ab8ff']} />
      <axesHelper />
      <Control />
      <Experience />
    </Canvas>
  )
}

export default Page
