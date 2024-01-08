'use client'

import { Scroll, ScrollControls, useGLTF, useScroll, OrbitControls } from '@react-three/drei'
import { Common } from '@/components/canvas/View'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'
import vertexShader from '@/templates/Shader/glsl/particles-simulation.vert'
import fragmentShader from '@/templates/Shader/glsl/particles-simulation.frag'
import vertextParRender from '@/templates/Shader/glsl/particles-render.vert'
import fragmentParRender from '@/templates/Shader/glsl/particles-render.frag'
import vertextAnimRender from '@/templates/Shader/glsl/horse-particles.vert'
import fragmentAnimRender from '@/templates/Shader/glsl/horse-particles.frag'
import { getModelGeometry, getTexture } from '@/utils/shared'
import FBOParticles from '@/components/shared/FBOParticles'

const MainBody = ({ pageQuantity }: { pageQuantity: number }) => {
  const width = 512,
    height = 512,
    range = 1.0 / pageQuantity

  const dragon = useGLTF('/models/horse.glb')
  const dragonAnim = dragon.animations
  const dragonScene = dragon.scene
  const dragonGeometry = useMemo(() => {
    const merge = getModelGeometry(dragon.nodes)
    return merge
  }, [dragon.nodes])

  const boy = useGLTF('/models/boy.glb')
  const boyGeometry = useMemo(() => {
    const merge = getModelGeometry(boy.nodes)
    return merge
  }, [boy.nodes])
  boyGeometry.scale(0.6, 0.6, 0.6)

  const goku = useGLTF('/models/goku.glb')
  const gokuGeometry = useMemo(() => {
    const merge = getModelGeometry(goku.nodes)
    return merge
  }, [goku.nodes])
  gokuGeometry.scale(0.6, 0.6, 0.3)
  gokuGeometry.rotateY(Math.PI / 2)
  gokuGeometry.rotateZ(-Math.PI / 4)
  goku.scene.children[0].position.set(-2, 0, 2)

  const refGeoParticles = useRef<THREE.BufferGeometry>(null)

  dragonGeometry.rotateY((3 * Math.PI) / 4)

  const uTextureA = getTexture(dragonGeometry)
  const uTextureB = getTexture(boyGeometry)
  const uTextureC = getTexture(gokuGeometry)
  const data = useScroll()
  const { camera } = useThree()

  const simGeoParticles = useMemo(() => {
    return {
      uniforms: {
        uTextureA: { type: 't', value: uTextureA },
        uTextureB: { type: 't', value: uTextureB },
        uTextureC: { type: 't', value: uTextureC },

        uTime: { value: 0 },
        uScroll: { value: 0 },
        uTreePos: { value: new THREE.Vector3() },
      },
      defines: {
        uTotalModels: pageQuantity.toFixed(2),
      },
      vertexShader,
      fragmentShader,
    }
  }, [pageQuantity, uTextureA, uTextureB, uTextureC])
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
        uScroll: { value: 0 },
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
    [pageQuantity, range],
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

  useFrame(({ gl, camera, scene, controls, clock }, delta) => {
    const elapedTime = clock.getElapsedTime()
    renderMatParticles.uniforms.uScroll.value = data.offset
    simGeoParticles.uniforms.uScroll.value = data.offset

    renderMatParticles.uniforms.uTime.value = elapedTime
    simGeoParticles.uniforms.uTime.value = elapedTime
    renderAnimParticles.uniforms.uTime.value = elapedTime

    mixer.current?.update(delta)
  })

  useEffect(() => {
    camera.position.set(0.5, 0.5, 1)
    camera.lookAt(new THREE.Vector3())
  }, [camera])

  //  For animaiton model

  const mixer = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    if (dragonAnim.length > 0) {
      mixer.current = new THREE.AnimationMixer(dragonScene)
      const action = mixer.current.clipAction(dragonAnim[0])
      action.play()
    }
  }, [dragonAnim, dragonScene])

  const renderAnimParticles = useMemo(
    () => ({
      uniforms: {
        uPositions: { value: null },
        uSize: { value: 12 },
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScroll: { value: 0 },
      },
      defines: {
        uTotalModels: pageQuantity.toFixed(2),
        uRange: range,
      },
      vertexShader: vertextAnimRender,
      fragmentShader: fragmentAnimRender,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
    [pageQuantity, range],
  )

  return (
    <>
      <FBOParticles
        simGeoParticles={simGeoParticles}
        renderMatParticles={renderMatParticles}
        particlesPosition={particlesPosition}
      />
      <points>
        <primitive attach='geometry' object={dragonGeometry} />
        <shaderMaterial args={[renderAnimParticles]} />
      </points>
    </>
  )
}

const Page = () => {
  const pageQuantity = 4
  return (
    <Canvas
      id='canvas-custom'
      className='fixed left-0 top-0 flex outline-none'
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
        alpha: false,
      }}
      camera={{
        position: [2, 2, 2],
      }}
    >
      <axesHelper />
      <ScrollControls pages={pageQuantity} damping={0.1}>
        <Common />
        <MainBody pageQuantity={pageQuantity} />
      </ScrollControls>
      <OrbitControls />
    </Canvas>
  )
}

export default Page
