'use client'
import { useRef, PropsWithChildren } from 'react'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import { Scene } from './Layout'

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
          // position: 'fixed',
          overflow: 'auto',
          // top: 0,
          // left: 0,
          // width: '100vw',
          // height: '100vh',
          // pointerEvents: 'none',
        }}
        eventSource={ref.current || undefined}
        eventPrefix='client'
        gl={{}}
      >
        <r3f.Out />
        <Preload all />
      </Scene>
    </div>
  )
}
