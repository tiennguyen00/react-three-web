'use client'

import { useRef, PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

const Layout = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        id='scene-canvas'
        style={{
          position: 'fixed',
          overflow: 'auto',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref.current || undefined}
        eventPrefix='client'
        gl={{}}
      >
        <r3f.Out />
        <Preload all />
        <Perf />
        <color args={['blue']} attach='background' />
      </Scene>
    </div>
  )
}

export { Layout }
