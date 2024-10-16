'use client'
import { Canvas, extend, Object3DNode, useFrame, useGraph } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import vertex from '@/components/shared/hologram/hologram.vert'
import fragment from '@/components/shared/hologram/hologram.frag'
import { useEffect, useRef } from 'react'

const HoloMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  vertex,
  fragment,
)
extend({ HoloMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    holoMaterial: Object3DNode<typeof HoloMaterial, typeof HoloMaterial>
  }
}

const Experience = () => {
  const { scene } = useGLTF('/models/suzanne.glb')
  const { nodes } = useGraph(scene)
  const holoMaterial = new HoloMaterial()
  holoMaterial.transparent = true

  const refGroup = useRef<THREE.Group>(null)

  useEffect(() => {
    Object.values(nodes).forEach((node) => {
      if ((node as THREE.Mesh).isMesh) {
        ;(node as THREE.Mesh).material = holoMaterial
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    holoMaterial.uniforms.uTime.value = elapsedTime

    if (refGroup.current) {
      refGroup.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.x = elapsedTime * 0.5
        }
      })
    }
  })

  return (
    <group ref={refGroup}>
      <mesh position-x={3} material={holoMaterial}>
        <torusGeometry args={[0.6, 0.25, 128, 32]} />
      </mesh>
      <mesh>
        <primitive object={scene} />
      </mesh>
      <mesh position-x={-3} material={holoMaterial}>
        <sphereGeometry />
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
