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
      className='fixed top-0 left-0 flex outline-none'
      camera={{
        position: [14.4666, 2.0365, 5.556165],
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
      }}
      shadows
    >
      <color attach='background' args={['#4ab8ff']} />
      <Perf position='top-left' />
      <axesHelper args={[25]} />
      <Control />
      <Physics debug>
        <Experience />
      </Physics>
    </Canvas>
  )
}

export default Page
