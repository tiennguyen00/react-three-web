'use client'

import { Canvas, CanvasProps } from '@react-three/fiber'
import { PropsWithChildren } from 'react'

export default function Scene({ ...props }: PropsWithChildren<CanvasProps>) {
  // Everything defined in here will persist between route changes, only children are swapped
  return <Canvas {...props}></Canvas>
}
