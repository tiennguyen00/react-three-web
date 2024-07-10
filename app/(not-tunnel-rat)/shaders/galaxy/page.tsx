'use client'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useControls } from 'leva'
import React, { useMemo } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/galaxy/galaxy.vert'
import fragment from '@/components/shared/galaxy/galaxy.frag'

const PointSpin = () => {
  const controls = useControls('Points', {
    count: 200000,
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
  })

  const { count, radius, branches, randomnessPower, randomness, insideColor, outsideColor, size } = controls

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const insideColorV = new THREE.Color(insideColor)
    const outsideColorV = new THREE.Color(outsideColor)

    Array.from(Array(count).keys()).forEach((i) => {
      const i3 = i * 3

      // Position
      const radiusR = Math.random() * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusR
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusR
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radiusR

      positions[i3] = Math.cos(branchAngle) * radiusR + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle) * radiusR + randomZ

      // Color
      const mixedColor = insideColorV.clone()
      mixedColor.lerp(outsideColorV, radiusR / radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    })

    return {
      positions,
      colors,
    }
  }, [branches, count, insideColor, outsideColor, radius, randomness, randomnessPower])

  return (
    <points>
      <bufferGeometry key={`${Object.entries(controls).flat(Infinity)}`}>
        <bufferAttribute attach='attributes-position' count={count} array={positions} itemSize={3} />
        <bufferAttribute attach='attributes-color' count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      {/* <pointsMaterial size={size} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} vertexColors /> */}
      <shaderMaterial
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={vertex}
        fragmentShader={fragment}
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
