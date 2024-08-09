'use client'
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/praticle-cursor/practicleCursor.vert'
import fragment from '@/components/shared/praticle-cursor/practicleCursor.frag'

const Components = () => {
  const { gl } = useThree()
  const pixelRatio = gl.getPixelRatio()

  const uniforms = useMemo(
    () => ({
      uResolution: new THREE.Uniform(
        new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
      ),
    }),
    [],
  )
  return (
    <points>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </points>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-cursor-particle'
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
      }}
      camera={{
        position: [0, 0, 18],
        fov: 35,
      }}
    >
      <color args={['black']} attach='background' />
      <axesHelper />
      <OrbitControls enableDamping />
      <Components />
    </Canvas>
  )
}

export default page
