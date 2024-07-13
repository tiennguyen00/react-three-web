'use client'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/galaxy/galaxy.vert'
import fragment from '@/components/shared/galaxy/galaxy.frag'

const PointSpin = () => {
  const {
    gl: { getPixelRatio },
  } = useThree()
  const pointRef = useRef<THREE.Points | null>(null)

  const controls = useControls('Points', {
    count: 200000,
    size: {
      value: 50,
      step: 0.5,
    },
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
  })

  const { count, radius, branches, randomnessPower, randomness, insideColor, outsideColor, size } = controls

  const { positions, colors, scales, aRandomness } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const aRandomness = new Float32Array(count * 3)

    const insideColorV = new THREE.Color(insideColor)
    const outsideColorV = new THREE.Color(outsideColor)

    Array.from(Array(count).keys()).forEach((i) => {
      const i3 = i * 3

      // Position
      const radiusR = Math.random() * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2

      positions[i3] = Math.cos(branchAngle) * radiusR
      positions[i3 + 1] = 0.0
      positions[i3 + 2] = Math.sin(branchAngle) * radiusR

      // Randomness
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radiusR
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radiusR
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * radiusR

      aRandomness[i3] = randomX
      aRandomness[i3 + 1] = randomY
      aRandomness[i3 + 2] = randomZ

      // Color
      const mixedColor = insideColorV.clone()
      mixedColor.lerp(outsideColorV, radiusR / radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b

      // Scale
      scales[i] = Math.random()
    })

    return {
      positions,
      colors,
      scales,
      aRandomness,
    }
  }, [branches, count, insideColor, outsideColor, radius, randomness, randomnessPower])

  const uniforms = useMemo(
    () => ({
      uSize: { value: 5 * getPixelRatio() },
      uTime: { value: 0 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uSize.value = size
  }, [size])

  useFrame((_, delta) => {
    if (!pointRef.current) return
    const t = _.clock.getElapsedTime()
    ;(pointRef.current?.material as THREE.ShaderMaterial).uniforms.uTime.value = t
  })

  return (
    <points ref={pointRef}>
      <bufferGeometry key={`${Object.entries(controls).flat(Infinity)}`}>
        <bufferAttribute attach='attributes-position' count={count} array={positions} itemSize={3} />
        <bufferAttribute attach='attributes-color' count={count} array={colors} itemSize={3} />
        <bufferAttribute attach='attributes-aScale' count={count} array={scales} itemSize={1} />
        <bufferAttribute attach='attributes-aRandomness' count={count} array={aRandomness} itemSize={3} />
      </bufferGeometry>
      {/* <pointsMaterial size={size} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} vertexColors /> */}
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </points>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-custom-galaxy'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [3, 3, 5],
      }}
    >
      <color args={['black']} attach='background' />
      <axesHelper />
      <OrbitControls />
      <PointSpin />
    </Canvas>
  )
}

export default page
