'use client'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, Object3DNode, useFrame, useThree } from '@react-three/fiber'
import vertex from '@/components/shared/gpgpu/gpgpu.vert'
import fragment from '@/components/shared/gpgpu/gpgpu.frag'
import gpgpuParticlesShader from '@/components/shared/gpgpu/particles.glsl'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

const GpgpuMaterial = shaderMaterial(
  {
    uSize: 0.4,
    uResolution: new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
    ),
  },
  vertex,
  fragment,
)

declare module '@react-three/fiber' {
  interface ThreeElements {
    gpgpuMaterial: Object3DNode<typeof GpgpuMaterial, typeof GpgpuMaterial>
  }
}
extend({ GpgpuMaterial })

const Experience = () => {
  const pointRef = useRef<THREE.Points>(null)
  const { gl } = useThree()

  const { gpuCompute, particlesVariable } = useMemo(() => {
    const count = pointRef.current?.geometry.attributes.position.count ?? 0

    const size = Math.ceil(Math.sqrt(count))

    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    // It’s a DataTexture which is similar to other Three.js textures but the pixels data is set up as an array which we can access in
    const baseParticleTexture = gpuCompute.createTexture()
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const i4 = i * 4

      //
      baseParticleTexture.image.data[i4 + 0] = pointRef.current?.geometry.attributes.position.array[i3 + 0] as number
      baseParticleTexture.image.data[i4 + 1] = pointRef.current?.geometry.attributes.position.array[i3 + 1] as number
      baseParticleTexture.image.data[i4 + 2] = pointRef.current?.geometry.attributes.position.array[i3 + 2] as number
      baseParticleTexture.image.data[i4 + 3] = 0
    }

    // Particles variables, GPU interact with those variables
    const particlesVariable = gpuCompute.addVariable('uParticles', gpgpuParticlesShader, baseParticleTexture)
    // we want the particles to persist in time, meaning that their coordinates will be saved and re-used in the next frame, The “variable” needs to be re-injected into itself
    gpuCompute.setVariableDependencies(particlesVariable, [particlesVariable])
    gpuCompute.init()

    return { gpuCompute, particlesVariable }
  }, [pointRef.current])

  useFrame((_, delta) => {
    gpuCompute?.compute()
  })

  return (
    <>
      <mesh position-x={3}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={gpuCompute?.getCurrentRenderTarget(particlesVariable).texture} />
      </mesh>
      <points ref={pointRef}>
        <sphereGeometry args={[3]} />
        <gpgpuMaterial />
      </points>
    </>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-gpgpu'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [4.5, 4, 11],
        fov: 35,
        near: 0.1,
        far: 100,
      }}
    >
      <color args={['#29191f']} attach='background' />
      <axesHelper />
      <OrbitControls enableDamping />
      <Experience />
    </Canvas>
  )
}

export default page
