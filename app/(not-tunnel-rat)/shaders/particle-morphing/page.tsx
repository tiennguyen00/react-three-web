'use client'
import { CycleRaycast, OrbitControls, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree, extend, Object3DNode } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/particle-morphing/particleMorphing.vert'
import fragment from '@/components/shared/particle-morphing/particleMorphing.frag'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'

const MorphingParticleMaterial = shaderMaterial(
  {
    uSize: 0.2,
    uResolution: new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
    ),
    uProgress: 0.0,
  },
  vertex,
  fragment,
)

declare module '@react-three/fiber' {
  interface ThreeElements {
    morphingParticleMaterial: Object3DNode<typeof MorphingParticleMaterial, typeof MorphingParticleMaterial>
  }
}
extend({ MorphingParticleMaterial })

const Experience = () => {
  const pointRef = useRef<THREE.Points>(null)
  const { clearColor, progess } = useControls('Points', {
    clearColor: '#160920',
    progess: {
      min: 0,
      max: 1,
      step: 0.1,
      value: 0,
    },
  })

  const { gl } = useThree()
  const models = useGLTF('/models/combine_models.glb')
  const [particles, setParticles] = useState<{
    positions: THREE.Float32BufferAttribute[]
  }>({
    positions: [],
  })

  useEffect(() => {
    if (!pointRef.current) return
    pointRef.current.geometry.setIndex(null)

    const positions = models.scene.children.map((child) => {
      return child.geometry.attributes.position
    })

    let maxCount = 0
    let float32BufferAttribute: any[] = []

    positions.forEach((i, index) => {
      if (i.count > maxCount) {
        maxCount = i.count
      }
    })
    positions.forEach((i) => {
      const originalArray = i.array
      const newArray = new Float32Array(maxCount * 3)

      for (let j = 0; j < maxCount; j++) {
        const i3 = j * 3
        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0]
          newArray[i3 + 1] = originalArray[i3 + 1]
          newArray[i3 + 2] = originalArray[i3 + 2]
        } else {
          const randomIndex = Math.floor(i.count * Math.random()) * 3
          newArray[i3 + 0] = originalArray[randomIndex + 0]
          newArray[i3 + 1] = originalArray[randomIndex + 1]
          newArray[i3 + 2] = originalArray[randomIndex + 2]
        }
      }
      float32BufferAttribute.push(new THREE.Float32BufferAttribute(newArray, 3))
    })

    setParticles({
      positions: float32BufferAttribute,
    })
  }, [])

  useEffect(() => {
    gl.setClearColor(clearColor)
    pointRef.current && (pointRef.current.material.uniforms.uProgress.value = progess)
  }, [clearColor, progess])

  return (
    <points ref={pointRef}>
      <bufferGeometry>
        {particles.positions[1] && particles.positions[3] && (
          <>
            <bufferAttribute
              attach='attributes-position'
              count={particles.positions[1].count}
              array={particles.positions[1].array}
              itemSize={3}
            />
            <bufferAttribute
              attach='attributes-aPositionTarget'
              count={particles.positions[3].count}
              array={particles.positions[3].array}
              itemSize={3}
            />
          </>
        )}
      </bufferGeometry>
      <axesHelper />
      <morphingParticleMaterial blending={THREE.AdditiveBlending} depthWrite={false} />
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
        near: 0.1,
        far: 100,
      }}
    >
      <Perf position='top-left' />

      {/* <color args={['black']} attach='background' /> */}
      <OrbitControls enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
