'use client'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import vertex from '@/components/shared/raging-sea/sea.vert'
import fragment from '@/components/shared/raging-sea/sea.glsl'
import * as THREE from 'three'
import { useControls } from 'leva'

const Plane = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { uBigWavesElevation, uBigWavesFrequency, uBigWavesSpeed } = useControls('Control', {
    uBigWavesElevation: {
      value: 0.2,
      step: 0.1,
    },
    uBigWavesFrequency: {
      value: {
        x: 4,
        y: 1.5,
      },
    },
    uBigWavesSpeed: {
      value: 0.75,
      step: 0.1,
    },
  })
  const uniforms = useMemo(
    () => ({
      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      uTime: { value: 0 },
      uBigWavesSpeed: { value: 0.75 },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!meshRef) return
    const t = state.clock.getElapsedTime()
    ;(meshRef.current?.material as THREE.ShaderMaterial).uniforms.uTime.value = t
  })

  useEffect(() => {
    uniforms.uBigWavesElevation.value = uBigWavesElevation
    uniforms.uBigWavesFrequency.value.x = uBigWavesFrequency.x
    uniforms.uBigWavesFrequency.value.y = uBigWavesFrequency.y
    uniforms.uBigWavesSpeed.value = uBigWavesSpeed
  }, [uBigWavesElevation, uniforms, uBigWavesFrequency, uBigWavesSpeed])

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI * 0.5}>
      <planeGeometry args={[2, 2, 128, 128]} />
      <shaderMaterial side={THREE.DoubleSide} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-custom'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [2, 2, 1],
      }}
    >
      <color args={['#FEFEE8']} attach='background' />
      <axesHelper />
      <Plane />
      <OrbitControls />
    </Canvas>
  )
}

export default page
