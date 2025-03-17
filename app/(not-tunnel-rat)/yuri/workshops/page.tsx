'use client'
import Experience from '@/components/yuri-workshops/Experience'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

const Page = () => {
  return (
    <Canvas
      id='yuri-workshops'
      className='flex fixed top-0 left-0 outline-none'
      shadows
      camera={{
        fov: 70,
        near: 0.01,
        far: 10,
        position: [0, 0, 3],
      }}
      gl={{
        alpha: true,
        antialias: true,
      }}
    >
      <color attach='background' args={['#222']} />
      <Perf position='top-left' />
      <axesHelper args={[25]} position={[0, 1, 0]} />
      <OrbitControls />
      <Experience />
    </Canvas>
  )
}

export default Page
