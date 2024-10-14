'use client'
import { Canvas, extend, Object3DNode, useGraph } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import vertex from '@/components/shared/hologram/hologram.vert'
import fragment from '@/components/shared/hologram/hologram.frag'
import { useEffect } from 'react'

const HoloMaterial = shaderMaterial({}, vertex, fragment)
extend({ HoloMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    holoMaterial: Object3DNode<typeof HoloMaterial, typeof HoloMaterial>
  }
}

const Experience = () => {
  const { scene } = useGLTF('/models/suzanne.glb')
  const { nodes } = useGraph(scene)

  useEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        ;(node as THREE.Mesh).material = new HoloMaterial()
      }
    })
  }, [])

  return (
    <group>
      <mesh position-x={3}>
        <torusGeometry args={[0.6, 0.25, 128, 32]} />
        <holoMaterial />
      </mesh>
      <mesh>
        <primitive object={scene} />
      </mesh>
      <mesh position-x={-3}>
        <sphereGeometry />
        <holoMaterial />
      </mesh>
    </group>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-hologram'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [8, 10, 12],
      }}
    >
      <color args={['black']} attach='background' />
      <axesHelper />
      <ambientLight intensity={1} color='white' />
      <OrbitControls target={[0, 3, 0]} enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
