'use client'

import { ScrollControls } from '@react-three/drei'
import { Suspense } from 'react'
import { SheetProvider } from '@theatre/r3f'
import { cameraMovementSheet, initTheatreStudio } from '@/animation/theatre'
import CameraControlTheatre from '@/utils/CameraControlTheatre'
import House from '@/components/scroll-with-theatre/House'
import dynamic from 'next/dynamic'
import { LoadingIcon } from '@/components/shared'
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <LoadingIcon />,
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

initTheatreStudio()
export default function Page() {
  return (
    <div className='flex h-full w-full'>
      <View className='flex h-full w-full flex-col items-center justify-center'>
        <SheetProvider sheet={cameraMovementSheet}>
          <Suspense fallback={null}>
            <ScrollControls pages={4}>
              <House
                props={{
                  scale: 8,
                  rotation: [0, Math.PI * 0.5, 0],
                }}
              />
              <Common defaultCamera={false} />
              <CameraControlTheatre />
            </ScrollControls>
          </Suspense>
        </SheetProvider>
      </View>
    </div>
  )
}
