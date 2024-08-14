'use client'
import { CycleRaycast, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/praticle-cursor/practicleCursor.vert'
import fragment from '@/components/shared/praticle-cursor/practicleCursor.frag'
import { Perf } from 'r3f-perf'
import useParticleCursor from './useParticleCursor'

const canvas = {
  width: 128,
  height: 128,
}
const aspectRatio = 1.731164383561644
const growSize = canvas.width * 0.35

const CanvasWebGL = ({
  setCanvasCursor,
  textureCanvas,
}: {
  setCanvasCursor: Dispatch<SetStateAction<THREE.Vector2>>
  textureCanvas?: THREE.CanvasTexture
}) => {
  const { gl } = useThree()
  const pixelRatio = gl.getPixelRatio()
  const texture = useTexture('/img/wlop-art.png')
  const planeRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uResolution: new THREE.Uniform(
        new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
      ),
      uTexture: new THREE.Uniform(texture),
      uDisplacementTexture: new THREE.Uniform(textureCanvas),
    }),
    [textureCanvas],
  )

  const raycaster = useRef(new THREE.Raycaster())
  const screenCursor = useRef(new THREE.Vector2(9999, 9999))

  useFrame(({ camera }) => {
    if (!planeRef.current) return
    raycaster.current.setFromCamera(screenCursor.current, camera)
    const intersections = raycaster.current.intersectObject(planeRef.current)

    if (intersections.length) {
      const uv = intersections[0].uv

      if (uv) {
        setCanvasCursor(new THREE.Vector2(uv.x * canvas.width * aspectRatio, (1 - uv.y) * canvas.height))
      }
    }
  })

  const pointRef = useRef<THREE.Points>(null)

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      // e.clientX: 0 -> 1
      screenCursor.current.x = (e.clientX / window.innerWidth) * 2 - 1 // left: -1, top: 1
      screenCursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1 // top: 1, bottom: -1
    }

    window.addEventListener('pointermove', handlePointerMove)

    pointRef.current?.geometry?.setIndex(null)
    pointRef.current?.geometry?.deleteAttribute('normal')

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const intensitiesArray = useMemo(() => {
    // if (!pointRef.current) return
    const result = new Float32Array(16641)
    for (let i = 0; i < 16641; i++) {
      result[i] = Math.random()
    }
    return result
  }, [])

  const angleArray = useMemo(() => {
    // if (!pointRef.current) return
    const result = new Float32Array(16641)
    for (let i = 0; i < 16641; i++) {
      result[i] = Math.random() * Math.PI * 2
    }
    return result
  }, [])

  return (
    <>
      <mesh ref={planeRef} visible={false}>
        <planeGeometry args={[10 * aspectRatio, 10]} />
        <meshBasicMaterial color='red' side={THREE.DoubleSide} />
      </mesh>

      <points ref={pointRef}>
        <planeGeometry args={[10 * aspectRatio, 10, 128, 128]}>
          <bufferAttribute attach='attributes-aIntensity' array={intensitiesArray} itemSize={1} />
          <bufferAttribute attach='attributes-aAngle' array={angleArray} itemSize={1} />
        </planeGeometry>
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  )
}

const Canvas2D = ({
  canvasCursor,
  setTextureCanvas,
  textureCanvas,
  alphaSpeed,
}: {
  canvasCursor: THREE.Vector2
  setTextureCanvas: (v: THREE.CanvasTexture) => void
  textureCanvas?: THREE.CanvasTexture
  alphaSpeed: number
}) => {
  const refCanvas2D = useRef<HTMLCanvasElement>(null)
  const requestID = useRef<number>(-1)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    setTextureCanvas(new THREE.CanvasTexture(refCanvas2D.current as any))
  }, [])

  useEffect(() => {
    // Create and cache the image once
    const image = new Image()
    image.src = '/img/glow.png'
    image.onload = () => {
      imageRef.current = image
    }

    // Cache the 2D context once
    if (refCanvas2D.current) {
      ctxRef.current = refCanvas2D.current.getContext('2d')
      ctxRef.current?.fillRect(0, 0, canvas.width * aspectRatio, canvas.height)
    }
  }, [])

  function playAnimation() {
    if (textureCanvas) {
      textureCanvas.needsUpdate = true
    }
    const ctx = ctxRef.current
    const image = imageRef.current

    if (ctx && image) {
      /**
       * Displacement
       */

      // Fade out
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.01
      ctx.fillRect(0, 0, canvas.width * aspectRatio, canvas.height)

      // Draw glow
      ctx.globalCompositeOperation = 'lighten'
      ctx.globalAlpha = alphaSpeed
      ctx.drawImage(image, canvasCursor.x - growSize * 0.5, canvasCursor.y - growSize * 0.5, growSize, growSize)
    }

    // requestID.current = requestAnimationFrame(playAnimation)
  }

  useEffect(() => {
    playAnimation()
  }, [canvasCursor])

  return (
    <canvas
      ref={refCanvas2D}
      className='fixed top-0 z-10'
      style={{
        width: `${256 * aspectRatio}px`,
        height: '256px',
      }}
      width={canvas.width * aspectRatio}
      height={canvas.height}
    ></canvas>
  )
}

const BodyCpt = () => {
  const { setTextureCanvas, textureCanvas, canvasCursor, setCanvasCursor } = useParticleCursor()
  const canvasCursorPrev = useRef(new THREE.Vector2(9999, 9999))
  const alphaSpeed = useRef(1)

  useEffect(() => {
    const distance = canvasCursorPrev.current.distanceTo(canvasCursor)
    canvasCursorPrev.current.copy(canvasCursor)
    alphaSpeed.current = Math.min(distance * 0.1, 1)
  }, [canvasCursor])

  return (
    <>
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
        <Perf />
        {/* <CycleRaycast
          onChanged={(objects, cycle) => {
            console.log('data: ', objects)
            return null
          }}
        /> */}
        <color args={['black']} attach='background' />
        <OrbitControls enableDamping />
        <CanvasWebGL setCanvasCursor={setCanvasCursor} textureCanvas={textureCanvas} />
      </Canvas>
      <Canvas2D
        canvasCursor={canvasCursor}
        alphaSpeed={alphaSpeed.current}
        textureCanvas={textureCanvas}
        setTextureCanvas={setTextureCanvas}
      />
    </>
  )
}

const page = () => {
  return <BodyCpt />
}

export default page
