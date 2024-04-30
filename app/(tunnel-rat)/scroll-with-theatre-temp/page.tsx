'use client'

import { Suspense } from 'react'
import { SheetProvider } from '@theatre/r3f'
import { cameraMovementSheet, initTheatreStudio } from '@/animation/theatre'
import CameraControlTheatre from '@/utils/CameraControlTheatre'
import House from '@/components/scroll-with-theatre/House'
import dynamic from 'next/dynamic'
import { LoadingIcon } from '@/components/shared'
import Ground from '@/components/scroll-with-theatre/Ground'
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <LoadingIcon />,
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

initTheatreStudio()
export default function Page() {
  return (
    <div className='flex size-full'>
      <View className='flex size-full flex-col items-center justify-center '>
        <SheetProvider sheet={cameraMovementSheet}>
          <Suspense fallback={null}>
            <Common defaultCamera={false} />
            <CameraControlTheatre />
            <Ground />
            <House
              props={{
                scale: 8,
                rotation: [0, Math.PI * 0.5, 0],
              }}
            />
          </Suspense>
        </SheetProvider>
      </View>
    </div>
  )
}
