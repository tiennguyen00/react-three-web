'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef, PropsWithChildren, HTMLAttributes } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

interface CommonProps {
  color?: string
  defaultCamera?: boolean
}

export const Common = ({ color, defaultCamera = true }: CommonProps) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color='blue' />
    {defaultCamera && <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />}
  </Suspense>
)

interface ViewProps extends HTMLAttributes<HTMLDivElement> {
  orbit?: boolean
}

const View = forwardRef<HTMLDivElement, PropsWithChildren<ViewProps>>(({ children, orbit, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null)
  useImperativeHandle<unknown, unknown>(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef as any}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
