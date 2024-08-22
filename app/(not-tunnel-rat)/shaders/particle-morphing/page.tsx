'use client'
import { CycleRaycast, OrbitControls, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree, extend, Object3DNode } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/particle-morphing/particleMorphing.vert'
import fragment from '@/components/shared/particle-morphing/particleMorphing.frag'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const MorphingParticleMaterial = shaderMaterial(
  {
    uSize: 0.4,
    uResolution: new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
    ),
    uProgress: 0.0,
    uColorA: new THREE.Color('#ff7300'),
    uColorB: new THREE.Color('#0091ff'),
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
    index: number
    sizesArray: Float32Array
  }>({
    positions: [],
    index: 3,
    sizesArray: [],
  })

  useEffect(() => {
    if (!pointRef.current) return

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

    // Size
    const sizesArray = new Float32Array(maxCount)
    for (let i = 0; i < maxCount; i++) {
      sizesArray[i] = Math.random()
    }

    setParticles({
      ...particles,
      positions: float32BufferAttribute,
      sizesArray: sizesArray,
    })
  }, [])

  useEffect(() => {
    gl.setClearColor(clearColor)
    pointRef.current && (pointRef.current.material.uniforms.uProgress.value = progess)
  }, [clearColor, progess])

  useGSAP(() => {
    pointRef.current &&
      gsap.fromTo(
        pointRef.current.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 10, ease: 'linear' },
      )
  }, [particles.index, pointRef.current])

  return (
    <points ref={pointRef} frustumCulled={false}>
      <bufferGeometry>
        {particles.positions[2] && particles.positions[3] && (
          <>
            <bufferAttribute
              attach='attributes-position'
              count={particles.positions[particles.index].count}
              array={particles.positions[particles.index].array}
              itemSize={3}
            />
            <bufferAttribute
              attach='attributes-aPositionTarget'
              count={particles.positions[particles.index >= 3 ? 0 : particles.index + 1].count}
              array={particles.positions[particles.index >= 3 ? 0 : particles.index + 1].array}
              itemSize={3}
            />
            <bufferAttribute
              attach='attributes-aSize'
              count={particles.sizesArray.length}
              array={particles.sizesArray}
              itemSize={1}
            />
          </>
        )}
      </bufferGeometry>

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
      <axesHelper />
      <OrbitControls enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
