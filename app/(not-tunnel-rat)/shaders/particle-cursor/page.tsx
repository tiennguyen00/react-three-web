'use client'
import { CycleRaycast, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/praticle-cursor/practicleCursor.vert'
import fragment from '@/components/shared/praticle-cursor/practicleCursor.frag'

const Components = () => {
  const [aspectRatio, setAspectRatio] = useState(1)
  const { gl } = useThree()
  const pixelRatio = gl.getPixelRatio()
  const texture = useTexture('/img/wlop-art.png')

  useEffect(() => {
    const img = new Image()
    img.src = texture.image.src
    img.onload = () => {
      const ratio = img.width / img.height
      setAspectRatio(ratio)
    }
  }, [texture])

  const uniforms = useMemo(
    () => ({
      uResolution: new THREE.Uniform(
        new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
      ),
      uTexture: new THREE.Uniform(texture),
    }),
    [],
  )

  return (
    <>
      <mesh position-z={-0.1}>
        <planeGeometry args={[10 * aspectRatio, 10]} />
        <meshBasicMaterial color='red' />
      </mesh>

      <mesh onPointerOver={(e) => e.stopPropagation()} position={[0, 0.5, 0.5]} name='hello' key='hello'>
        <boxGeometry />
        <meshBasicMaterial color='blue' />
      </mesh>

      <points>
        <planeGeometry args={[10 * aspectRatio, 10, 128, 128]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
      </points>
    </>
  )
}

const Canvas2D = () => {
  const refCanvas2D = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (refCanvas2D.current) {
      const ctx = refCanvas2D.current.getContext('2d')

      if (ctx) {
        ctx.fillRect(0, 0, 128, 128)
        const image = new Image()
        image.src = '/img/glow.png'
        image.onload = () => {
          ctx.drawImage(image, 20, 20, 32, 32)
        }
      }
    }
  }, [refCanvas2D])

  return (
    <canvas
      ref={refCanvas2D}
      className='fixed left-20 top-0 z-10'
      style={{
        width: '512px',
        height: '512px',
      }}
      width={128}
      height={128}
    ></canvas>
  )
}

const page = () => {
  return (
    <>
      <Canvas2D />
      <Canvas
        id='canvas-cursor-particle'
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
        }}
        camera={{
          position: [0, 0, 32],
          fov: 35,
        }}
      >
        <CycleRaycast
          onChanged={(objects, cycle) => {
            console.log('data: ', objects)
          }}
        />
        <color args={['black']} attach='background' />
        <axesHelper />
        <OrbitControls enableDamping />
        <Components />
      </Canvas>
    </>
  )
}

export default page
