'use client'
import { CycleRaycast, OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/particle-morphing/particleMorphing.vert'
import fragment from '@/components/shared/particle-morphing/particleMorphing.frag'
import { Perf } from 'r3f-perf'
import { folder, useControls } from 'leva'

const Experience = () => {
  const { clearColor } = useControls('Points', {
    clearColor: '#160290',
  })

  const { gl } = useThree()
  const pixelRatio = gl.getPixelRatio()
  const MorphingParticleMaterial = shaderMaterial(
    {
      uSize: 0.4,
      uResolution: new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
    },
    vertex,
    fragment,
  )
  extend({ MorphingParticleMaterial })

  useEffect(() => {
    gl.setClearColor(clearColor)
  }, [clearColor])

  return (
    <points>
      <sphereGeometry args={[3]} />
      <morphingParticleMaterial />
    </points>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-particle-morphing'
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
      }}
      camera={{
        position: [0, 0, 16],
        fov: 35,
      }}
    >
      <Perf position='top-left' />

      <color args={['black']} attach='background' />
      <OrbitControls enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
