'use client'
import { OrbitControls, shaderMaterial, useGLTF } from '@react-three/drei'
import { Canvas, extend, Object3DNode, useFrame, useThree } from '@react-three/fiber'
import vertex from '@/components/shared/gpgpu/gpgpu.vert'
import fragment from '@/components/shared/gpgpu/gpgpu.frag'
import gpgpuParticlesShader from '@/components/shared/gpgpu/particles.glsl'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

const GpgpuMaterial = shaderMaterial(
  {
    uSize: 0.4,
    uResolution: new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio,
    ),
    uParticlesTexture: new THREE.Texture(),
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
    /**
     * Base geometry
     */
    const baseGeometry: any = {}
    baseGeometry.instance = new THREE.SphereGeometry(3)
    baseGeometry.count = baseGeometry.instance.attributes.position.count

    const size = Math.ceil(Math.sqrt(baseGeometry.count))

    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    // It’s a DataTexture which is similar to other Three.js textures but the pixels data is set up as an array which we can access in "baseParticleTexture.image.data"
    const baseParticleTexture = gpuCompute.createTexture()
    for (let i = 0; i < baseGeometry.count; i++) {
      const i3 = i * 3
      const i4 = i * 4

      //
      baseParticleTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0] as number
      baseParticleTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1] as number
      baseParticleTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2] as number
      baseParticleTexture.image.data[i4 + 3] = 0
    }

    // Particles variables, GPU interact with those variables
    // "uParticles" (texture) is the name of the variable, it will be injected in the shader
    const particlesVariable = gpuCompute.addVariable('uParticles', gpgpuParticlesShader, baseParticleTexture)

    // we want the particles to persist in time, meaning that their coordinates will be saved and re-used in the next frame, The “variable” needs to be re-injected into itself
    gpuCompute.setVariableDependencies(particlesVariable, [particlesVariable])
    gpuCompute.init()

    const particlesUvArray = new Float32Array(baseGeometry.count * 2)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x
        const i2 = i * 2

        const uvX = (x + 0.5) / size
        const uvY = (y + 0.5) / size

        particlesUvArray[i2 + 0] = uvX
        particlesUvArray[i2 + 1] = uvY
      }
    }
    // console.table(particlesUvArray)

    pointRef.current?.geometry.setDrawRange(0, baseGeometry.count)
    pointRef.current?.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))

    return { gpuCompute, particlesVariable }
  }, [pointRef.current])

  useFrame((_, delta) => {
    gpuCompute?.compute()
    if (pointRef.current) {
      const { uniforms } = pointRef.current.material as THREE.ShaderMaterial
      uniforms.uParticlesTexture.value = gpuCompute?.getCurrentRenderTarget(particlesVariable).texture
    }
  })

  return (
    <>
      <mesh position-x={3}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={gpuCompute?.getCurrentRenderTarget(particlesVariable).texture} />
      </mesh>
      <points ref={pointRef}>
        <bufferGeometry />
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
