'use client'
import { OrbitControls, shaderMaterial, useGLTF } from '@react-three/drei'
import { Canvas, extend, Object3DNode, useFrame, useThree } from '@react-three/fiber'
import vertex from '@/components/shared/gpgpu/gpgpu.vert'
import fragment from '@/components/shared/gpgpu/gpgpu.frag'
import gpgpuParticlesShader from '@/components/shared/gpgpu/particles.glsl'

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { useControls } from 'leva'

const GpgpuMaterial = shaderMaterial(
  {
    uSize: 0.07,
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

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const Experience = () => {
  const pointRef = useRef<THREE.Points>(null)
  const { gl } = useThree()
  const [model, setModel] = useState(null)
  const { flowFieldInfluence, flowFieldStrength } = useControls('Points', {
    flowFieldInfluence: {
      value: 0.4,
      step: 0.1,
      min: 0.0,
      max: 1.0,
    },
    flowFieldStrength: {
      value: 0.75,
      step: 0.001,
      min: 0,
      max: 10,
    },
  })

  useEffect(() => {
    const loadModelAsync = async () => {
      const loadedModel = await gltfLoader.loadAsync('/models/fleet.glb')
      setModel(loadedModel)
    }
    loadModelAsync()
  }, [])

  const { gpuCompute, particlesVariable } = useMemo(() => {
    console.log('model', model)

    /**
     * Base geometry
     */
    const baseGeometry: any = {}

    baseGeometry.instance = model ? model.scene.children[0].geometry : new THREE.SphereGeometry(3)
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
      baseParticleTexture.image.data[i4 + 3] = Math.random()
    }

    // Particles variables, GPU interact with those variables
    // "uParticles" (texture) is the name of the variable, it will be injected in the shader
    const particlesVariable = gpuCompute.addVariable('uParticles', gpgpuParticlesShader, baseParticleTexture)
    particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
    particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticleTexture)
    particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
    particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.4)
    particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(0.75)

    // we want the particles to persist in time, meaning that their coordinates will be saved and re-used in the next frame, The “variable” needs to be re-injected into itself
    gpuCompute.setVariableDependencies(particlesVariable, [particlesVariable])
    gpuCompute.init()

    const particlesUvArray = new Float32Array(baseGeometry.count * 2)
    const sizesArray = new Float32Array(baseGeometry.count)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x
        const i2 = i * 2

        const uvX = (x + 0.5) / size
        const uvY = (y + 0.5) / size

        particlesUvArray[i2 + 0] = uvX
        particlesUvArray[i2 + 1] = uvY

        sizesArray[i] = Math.random()
      }
    }

    pointRef.current?.geometry.setDrawRange(0, baseGeometry.count)
    pointRef.current?.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))
    pointRef.current?.geometry.setAttribute('aColor', baseGeometry.instance.attributes.color)
    pointRef.current?.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizesArray, 1))

    return { gpuCompute, particlesVariable }
  }, [model])

  useEffect(() => {
    particlesVariable.material.uniforms.uFlowFieldInfluence.value = flowFieldInfluence
    particlesVariable.material.uniforms.uFlowFieldStrength.value = flowFieldStrength
  }, [flowFieldInfluence, flowFieldStrength])

  useFrame(({ clock }, delta) => {
    gpuCompute?.compute()
    if (pointRef.current) {
      const { uniforms } = pointRef.current.material as THREE.ShaderMaterial
      uniforms.uParticlesTexture.value = gpuCompute?.getCurrentRenderTarget(particlesVariable).texture
    }
    const elapsedTime = clock.getElapsedTime()
    particlesVariable.material.uniforms.uTime.value = elapsedTime
    particlesVariable.material.uniforms.uDeltaTime.value = delta
  })

  return (
    <>
      {/* <mesh position-x={3}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={gpuCompute?.getCurrentRenderTarget(particlesVariable).texture} />
      </mesh> */}
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
