'use client'

import { Points, Scroll, ScrollControls, useFBO, useGLTF, useScroll } from '@react-three/drei'
import { Common } from '@/components/canvas/View'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import vertexShader from '@/templates/Shader/glsl/particles-simulation.vert'
import fragmentShader from '@/templates/Shader/glsl/particles-simulation.frag'
import vertextParRender from '@/templates/Shader/glsl/particles-render.vert'
import fragmentParRender from '@/templates/Shader/glsl/particles-render.frag'

const makeTexture = (g) => {
  let vertAmount = g.attributes.position.count
  let texWidth = Math.ceil(Math.sqrt(vertAmount))
  let texHeight = Math.ceil(vertAmount / texWidth)

  let data = new Float32Array(texWidth * texHeight * 4)

  function shuffleArrayByThree(array) {
    const groupLength = 3

    let numGroups = Math.floor(array.length / groupLength)

    for (let i = numGroups - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      for (let k = 0; k < groupLength; k++) {
        let temp = array[i * groupLength + k]
        array[i * groupLength + k] = array[j * groupLength + k]
        array[j * groupLength + k] = temp
      }
    }

    return array
  }

  shuffleArrayByThree(g.attributes.position.array)

  for (let i = 0; i < vertAmount; i++) {
    //let f = Math.floor(Math.random() * (randomTemp.length / 3) );

    const x = g.attributes.position.array[i * 3 + 0]
    const y = g.attributes.position.array[i * 3 + 1]
    const z = g.attributes.position.array[i * 3 + 2]
    const w = 0

    //randomTemp.splice(f * 3, 3);

    data[i * 4 + 0] = x
    data[i * 4 + 1] = y
    data[i * 4 + 2] = z
    data[i * 4 + 3] = w
  }

  let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType)
  dataTexture.needsUpdate = true

  return dataTexture
}

const MainBody = () => {
  const dog = useGLTF('/models/dog.glb')
  const dogGeometry = dog.scene.children[0].geometry
  const refGeoParticles = useRef<THREE.BufferGeometry>(null)
  const refPoints = useRef(null)
  const {
    size: { width, height },
  } = useThree()

  const uTextureA = makeTexture(dogGeometry)
  const data = useScroll()
  const renderTarger = useFBO({
    minFilter: THREE.NearestFilter, // Important because we want to sample square pixels
    magFilter: THREE.NearestFilter,
    generateMipmaps: false, // No need
    colorSpace: THREE.SRGBColorSpace, // No need
    depthBuffer: false, // No need
    stencilBuffer: false, // No need
    format: THREE.RGBAFormat, // Or RGBAFormat instead (to have a color for each particle, for example)
    type: THREE.FloatType, // Important because we need precise coordinates (not ints)
  })

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTextureA: { value: uTextureA },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTreePos: { value: new THREE.Vector3() },
      },
      defines: {
        uTotalModels: parseFloat('1').toFixed(2),
      },
      vertexShader,
      fragmentShader,
    }),
    [],
  )

  const renderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uPositions: { value: null },
      uSize: { value: 12 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uScroll: { value: 1.0 },
    },
    defines: {
      uTotalModels: parseFloat('1').toFixed(2),
      uRange: 1.0,
    },
    vertexShader: vertextParRender,
    fragmentShader: fragmentParRender,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const particlesGeometry = useMemo(() => {
    const length = width * height
    let vertices = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      let i3 = i * 3
      vertices[i3 + 0] = (i % width) / width
      vertices[i3 + 1] = i / width / height
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    return geometry
  }, [width, height])

  useEffect(() => {
    if (!refGeoParticles.current) return

    const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0])
    const uv = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
    refGeoParticles.current.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    refGeoParticles.current.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  }, [])

  useFrame((state) => {
    state.gl.setRenderTarget(renderTarger)
    state.gl.clear()
    state.gl.render(state.scene, state.camera)
    state.gl.setRenderTarget(null)
  })

  return (
    <>
      <mesh>
        <bufferGeometry ref={refGeoParticles} />
        <shaderMaterial args={[shaderArgs]} />
      </mesh>

      <Points geometry={particlesGeometry} material={renderMaterial} />
      {/* <mesh>
        <shaderMaterial />
      </mesh> */}
    </>
  )
}

const Page = () => {
  return (
    <Canvas id='canvas-custom' className='flex h-full w-full flex-col items-center justify-center'>
      <ScrollControls pages={4} damping={0.1}>
        <Common />
        <Scroll>
          <MainBody />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

export default Page
