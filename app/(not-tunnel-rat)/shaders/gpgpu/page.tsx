'use client'
import { OrbitControls, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, extend, Object3DNode, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import vertex from '@/components/shared/gpgpu/gpgpu.vert'
import fragment from '@/components/shared/gpgpu/gpgpu.frag'
import * as THREE from 'three'

const GpgpuMaterial = shaderMaterial(
  {
    uSize: 0.4,
    uResolution: new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
    ),
  },
  vertex,
  fragment,
)

declare module '@react-three/fiber' {
  interface ThreeElements {
    gpgpuMaterial: Object3DNode<typeof GpgpuMaterial, typeof GpgpuMaterial>
  }
}
extend({ GpgpuMaterial })

const Experience = () => {
  return (
    <points>
      <sphereGeometry args={[3]} />
      <gpgpuMaterial />
    </points>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-gpgpu'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [4.5, 4, 11],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
    >
      <color args={['#29191f']} attach='background' />
      <axesHelper />
      <OrbitControls enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
