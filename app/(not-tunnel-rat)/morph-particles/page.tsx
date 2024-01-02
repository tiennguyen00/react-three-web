'use client'

import {
  Points,
  Scroll,
  ScrollControls,
  useFBO,
  useGLTF,
  useScroll,
  OrbitControls,
  PointMaterial,
  MeshTransmissionMaterial,
} from '@react-three/drei'
import { Common } from '@/components/canvas/View'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import vertexShader from '@/templates/Shader/glsl/particles-simulation.vert'
import fragmentShader from '@/templates/Shader/glsl/particles-simulation.frag'
import vertextParRender from '@/templates/Shader/glsl/particles-render.vert'
import fragmentParRender from '@/templates/Shader/glsl/particles-render.frag'
import { getModelGeometry } from '@/utils/shared'
import FBOParticles from '@/components/shared/FBOParticles'

const makeTexture = (g: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
  let vertAmount = g.attributes.position.count
  let texWidth = Math.ceil(Math.sqrt(vertAmount))
  let texHeight = Math.ceil(vertAmount / texWidth)

  let data = new Float32Array(texWidth * texHeight * 4)

  function shuffleArrayByThree(array: THREE.TypedArray) {
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

    const red = g.attributes.position.array[i * 3 + 0]
    const green = g.attributes.position.array[i * 3 + 1]
    const blue = g.attributes.position.array[i * 3 + 2]
    const alpha = 0

    //randomTemp.splice(f * 3, 3);

    data[i * 4 + 0] = red
    data[i * 4 + 1] = green
    data[i * 4 + 2] = blue
    data[i * 4 + 3] = alpha
  }

  let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType)
  dataTexture.needsUpdate = true

  return dataTexture
}

const MainBody = ({ pageQuantity }: { pageQuantity: number }) => {
  const width = 512,
    height = 512,
    range = 1.0 / pageQuantity

  const conan = useGLTF('/models/boy.glb')
  const conanGeometry = useMemo(() => {
    const merge = getModelGeometry(conan.nodes)
    return merge
  }, [conan.nodes])

  const refGeoParticles = useRef<THREE.BufferGeometry>(null)

  const uTextureA = makeTexture(conanGeometry)
  const data = useScroll()

  const simGeoParticles = useMemo(() => {
    return {
      uniforms: {
        uTextureA: { type: 't', value: uTextureA },
        uTime: { value: 0 },
        uScroll: { value: data.offset },
        uTreePos: { value: new THREE.Vector3() },
      },
      defines: {
        uTotalModels: pageQuantity.toFixed(2),
      },
      vertexShader,
      fragmentShader,
    }
  }, [data.offset, pageQuantity, uTextureA])
  useEffect(() => {
    if (refGeoParticles.current) {
      const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0])
      const uv = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])
      refGeoParticles.current.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      refGeoParticles.current.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    }
  }, [])

  const renderMatParticles = useMemo(
    () => ({
      uniforms: {
        uPositions: { value: null },
        uSize: { value: 12 },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScroll: { value: data.offset },
      },
      defines: {
        uTotalModels: pageQuantity.toFixed(2),
        uRange: range,
      },
      vertexShader: vertextParRender,
      fragmentShader: fragmentParRender,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [data.offset, pageQuantity, range],
  )

  const particlesPosition = useMemo(() => {
    const length = width * height

    let vertices = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      let i3 = i * 3
      vertices[i3 + 0] = (i % width) / width
      vertices[i3 + 1] = i / width / height
      vertices[i3 + 2] = 0
    }
    return vertices
  }, [])

  useFrame(({ gl, camera, scene, controls }) => {})

  return (
    <FBOParticles
      simGeoParticles={simGeoParticles}
      renderMatParticles={renderMatParticles}
      particlesPosition={particlesPosition}
    />
  )
}

const Page = () => {
  const pageQuantity = 4
  return (
    <Canvas
      id='canvas-custom'
      className='flex h-full w-full flex-col items-center justify-center'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
    >
      <ScrollControls pages={pageQuantity} damping={0.1}>
        <Common />
        <Scroll>
          <MainBody pageQuantity={pageQuantity} />
        </Scroll>
      </ScrollControls>
      <OrbitControls />
    </Canvas>
  )
}

export default Page
