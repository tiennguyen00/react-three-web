'use client'
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import vertex from '@/components/shared/coffee/coffee.vert'
import fragment from '@/components/shared/coffee/coffee.frag'
import * as THREE from 'three'

const Coffee = () => {
  const { scene } = useGLTF('/models/baked-model.glb')

  return (
    <group>
      <primitive object={scene} />
    </group>
  )
}
const Smoke = () => {
  const testRef = useRef<THREE.PlaneGeometry>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  const texture = useTexture('/img/perlin.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  useEffect(() => {
    if (!testRef.current) return
    testRef.current.translate(0, 0.5, 0)
    testRef.current.scale(1.5, 6, 1.5)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef) return
    const t = state.clock.getElapsedTime()
    ;(meshRef.current?.material as THREE.ShaderMaterial).uniforms.uTime.value = t
  })

  return (
    <mesh position-y={1.83} ref={meshRef}>
      <planeGeometry ref={testRef} args={[1, 1, 16, 64]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
        uniforms={{
          uPerlinTexture: new THREE.Uniform(texture),
          uTime: new THREE.Uniform(0),
        }}
        transparent
      />
    </mesh>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-coffee-smoke'
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
      <OrbitControls target={[0, 3, 0]} enableDamping />
      <Coffee />
      <Smoke />
    </Canvas>
  )
}

export default page
