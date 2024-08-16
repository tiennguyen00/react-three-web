'use client'
import { CycleRaycast, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/praticle-cursor/practicleCursor.vert'
import fragment from '@/components/shared/praticle-cursor/practicleCursor.frag'
import { Perf } from 'r3f-perf'

const canvasInfo = {
  width: 128,
  height: 128,
}
const aspectRatio = 1.731164383561644
const growSize = canvasInfo.width * 0.35

const CanvasWebGL = () => {
  const { gl } = useThree()
  const pixelRatio = gl.getPixelRatio()
  const raycaster = new THREE.Raycaster()
  const texture = useTexture('/img/wlop-art.png')

  const planeRef = useRef<THREE.Mesh>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasCursorPrev = useRef(new THREE.Vector2(9999, 9999))
  const screenCursor = useRef(new THREE.Vector2(9999, 9999))
  const pointRef = useRef<THREE.Points>(null)
  const textureCanvas = useRef<THREE.CanvasTexture>()

  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [ctxCanvas, setCtxCanvas] = useState<CanvasRenderingContext2D>()

  // Create canvas2D
  useEffect(() => {
    const canvas2D = document.createElement('canvas')
    setCanvas(canvas2D)
    textureCanvas.current = new THREE.CanvasTexture(canvas2D)
    canvas2D.width = canvasInfo.width * aspectRatio
    canvas2D.height = canvasInfo.height

    canvas2D.style.width = `${256 * aspectRatio}px`
    canvas2D.style.height = `${256}px`
    canvas2D.style.position = 'fixed'
    canvas2D.style.top = '0'
    canvas2D.style.left = '0'
    canvas2D.style.zIndex = '1000'

    document.body.append(canvas2D)
    const ctx = canvas2D.getContext('2d')
    ctx?.fillRect(0, 0, canvasInfo.width * aspectRatio, canvasInfo.height)
    if (ctx) setCtxCanvas(ctx)

    // Load inage texture
    const image = new Image()
    image.src = '/img/glow.png'
    image.onload = () => {
      imageRef.current = image
    }

    pointRef.current?.geometry?.setIndex(null)
    pointRef.current?.geometry?.deleteAttribute('normal')

    return () => {
      document.body.removeChild(canvas2D)
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uResolution: new THREE.Uniform(
        new THREE.Vector2(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio),
      ),
      uTexture: new THREE.Uniform(texture),
      uDisplacementTexture: new THREE.Uniform(canvas),
    }),
    [],
  )

  useFrame(({ camera }) => {
    if (textureCanvas.current) textureCanvas.current.needsUpdate = true

    if (pointRef.current)
      (pointRef.current?.material as THREE.ShaderMaterial).uniforms.uDisplacementTexture.value = textureCanvas.current

    if (planeRef.current) {
      raycaster.setFromCamera(screenCursor.current, camera)
      const intersections = raycaster.intersectObject(planeRef.current)

      if (intersections.length) {
        const uv = intersections[0].uv // (0; 0) bottom-left || (1; 1) top-right

        if (uv) {
          const canvasCursor = new THREE.Vector2(uv.x * canvasInfo.width * aspectRatio, (1 - uv.y) * canvasInfo.height)
          const alphaSpeed = Math.min(canvasCursorPrev.current.distanceTo(canvasCursor) * 0.1, 1)
          canvasCursorPrev.current.copy(canvasCursor)
          if (ctxCanvas && imageRef.current) {
            /**
             * Displacement
             */
            // Fade out
            ctxCanvas.globalCompositeOperation = 'source-over'
            ctxCanvas.globalAlpha = 0.02
            ctxCanvas.fillRect(0, 0, canvasInfo.width * aspectRatio, canvasInfo.height)

            // Draw glow
            ctxCanvas.globalCompositeOperation = 'lighten'
            ctxCanvas.globalAlpha = alphaSpeed
            ctxCanvas.drawImage(
              imageRef.current,
              canvasCursor.x - growSize * 0.5,
              canvasCursor.y - growSize * 0.5,
              growSize,
              growSize,
            )
          }
        }
      }
    }
  })

  const [attributeArray, setAttributeArray] = useState<Array<Float32Array | undefined>>([undefined, undefined])

  useEffect(() => {
    if (!pointRef.current) return
    const count = pointRef.current.geometry.attributes.position.count

    const intensitiesArray = new Float32Array(count),
      angleArray = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      intensitiesArray[i] = Math.random()
      angleArray[i] = Math.random() * Math.PI * 2
    }

    setAttributeArray([intensitiesArray, angleArray])
  }, [pointRef.current])

  return (
    <>
      <mesh
        ref={planeRef}
        onPointerMove={(e) => {
          screenCursor.current.x = (e.clientX / window.innerWidth) * 2 - 1 // left: -1, top: 1
          screenCursor.current.y = -(e.clientY / window.innerHeight) * 2 + 1 // top: 1, bottom: -1
        }}
        visible={false}
      >
        <planeGeometry args={[10 * aspectRatio, 10]} />
        <meshBasicMaterial color='red' side={THREE.DoubleSide} />
      </mesh>

      <points ref={pointRef}>
        <planeGeometry args={[10 * aspectRatio, 10, 128, 128]}>
          {attributeArray[0] && attributeArray[1] && (
            <>
              <bufferAttribute attach='attributes-aIntensity' array={attributeArray[0]} itemSize={1} />
              <bufferAttribute attach='attributes-aAngle' array={attributeArray[1]} itemSize={1} />
            </>
          )}
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

const page = () => {
  return (
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
      <color args={['black']} attach='background' />
      <OrbitControls enableDamping />
      <CanvasWebGL />
    </Canvas>
  )
}

export default page
