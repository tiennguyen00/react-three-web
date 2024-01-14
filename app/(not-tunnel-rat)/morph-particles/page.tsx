'use client'

import { Scroll, ScrollControls, useGLTF, useScroll, OrbitControls, useFBX } from '@react-three/drei'
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

  const horse = useGLTF('/models/horse.glb')
  const horseGeometry = useMemo(() => {
    const merge = getModelGeometry(horse.nodes)
    return merge
  }, [horse.nodes])
  horseGeometry.scale(0.1, 0.1, 0.1)

  const mixamo = useGLTF('/models/mixamo.glb')
  const mixamoAnim = mixamo.animations
  const mixamoScene = mixamo.scene
  const mixamoGeometry = useMemo(() => {
    const merge = getModelGeometry(mixamo.nodes)
    return merge
  }, [mixamo.nodes])
  mixamoGeometry.rotateY((3 * Math.PI) / 4)
  mixamoGeometry.scale(0.6, 0.6, 0.6)

  const boy = useGLTF('/models/boy.glb')
  const boyGeometry = useMemo(() => {
    const merge = getModelGeometry(boy.nodes)
    return merge
  }, [boy.nodes])
  boyGeometry.scale(0.6, 0.6, 0.6)

  const refGeoParticles = useRef<THREE.BufferGeometry>(null)

  const uTextureA = getTexture(mixamoGeometry)
  const uTextureB = getTexture(boyGeometry)
  const uTextureC = getTexture(horseGeometry)

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
    renderAnimParticles.uniforms.uScroll.value = data.offset

    renderMatParticles.uniforms.uTime.value = elapedTime
    // simGeoParticles.uniforms.uTime.value = elapedTime
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
    if (mixamoAnim.length > 0) {
      mixer.current = new THREE.AnimationMixer(mixamoScene)
      const action = mixer.current.clipAction(mixamoAnim[0])
      action.play()
    }
  }, [mixamoAnim, mixamoScene])

  const renderAnimParticles = useMemo(
    () => ({
      uniforms: {
        uPositions: { value: null },
        uSize: { value: 2 },
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
      // blending: THREE.AdditiveBlending,
    }),
    [pageQuantity, range],
  )

  const refMesh = useRef<THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.ShaderMaterial>>(null)

  useEffect(() => {
    if (!refMesh.current) return
    refMesh.current.morphTargetInfluences = mixamo.nodes.Ch03.morphTargetInfluences
    refMesh.current.morphTargetDictionary = mixamo.nodes.Ch03.morphTargetDictionary

    // console.log('refMesgL: ', refMesh)
    // console.log('mixamo: ', mixamo)
    // console.log('horse: ', horse)
  }, [horse, mixamo.nodes.Ch03, refMesh])

  return (
    <>
      <FBOParticles
        simGeoParticles={simGeoParticles}
        renderMatParticles={renderMatParticles}
        particlesPosition={particlesPosition}
      />
      <points ref={refMesh}>
        <primitive attach='geometry' object={mixamoGeometry} />
        <shaderMaterial args={[renderAnimParticles]} />
      </points>
      ````
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group scale={[0.1, 0.1, 0.1]} rotation={[0, Math.PI / 4, 0]}>
        <primitive object={mixamoScene} />
      </group>
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
