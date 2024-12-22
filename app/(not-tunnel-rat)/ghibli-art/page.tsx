'use client'
import Control from '@/components/ghibli-art/Control'
import Experience from '@/components/ghibli-art/Experience'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'

const Page = () => {
  return (
    <Canvas
      id='ghibli-art-canvas'
      className='fixed left-0 top-0 flex outline-none'
      camera={{
        position: [14.4666, 2.0365, 5.556165],
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
        toneMappingExposure: 1.0,
      }}
      shadows
    >
      <color attach='background' args={['#4ab8ff']} />
      <Perf position='top-left' />
      <axesHelper args={[25]} position={[0, 1, 0]} />
      <Control />
      <Physics>
        <Experience />
      </Physics>
    </Canvas>
  )
}

export default Page
