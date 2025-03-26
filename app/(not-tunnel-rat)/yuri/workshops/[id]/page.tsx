'use client'
import Experience from '@/components/ghibli-art/Experience'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Experience2 from '@/components/yuri-workshops/Experience2'
const page = ({ params }: { params: { id: string } }) => {
  return (
    <Canvas
      id='yuri-workshops'
      className='fixed left-0 top-0 flex outline-none'
      shadows
      camera={{
        fov: 70,
        near: 0.01,
        far: 10,
        position: [0, 0, 2],
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
      {params.id === '1' ? <Experience /> : <Experience2 />}
    </Canvas>
  )
}

export default page
