'use client'

import { ScrollControls, Scroll } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { LoadingIcon } from '@/components/shared/LoadingIcon'
import { Common } from '@/components/canvas/View'
import { Canvas } from '@react-three/fiber'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <LoadingIcon />,
})

const Page = () => {
  return (
    <Canvas className='flex flex-col items-center justify-center bg-red-300'>
      <ScrollControls pages={4} damping={0.1}>
        <Common />
      </ScrollControls>
    </Canvas>
  )
}

export default Page
