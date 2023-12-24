'use client'

import { Scroll, ScrollControls, useScroll } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { LoadingIcon } from '@/components/shared/LoadingIcon'
import { Common } from '@/components/canvas/View'
import { Canvas, useFrame } from '@react-three/fiber'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <LoadingIcon />,
})

const Test = () => {
  const data = useScroll()

  return (
    <mesh>
      <boxGeometry />
      <lineBasicMaterial />
    </mesh>
  )
}

const Page = () => {
  return (
    <Canvas id='canvas-custom' className='flex h-full w-full flex-col items-center justify-center bg-red-300'>
      <ScrollControls pages={4} damping={0.1}>
        <Common />
        <Scroll>
          <Test />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

export default Page
