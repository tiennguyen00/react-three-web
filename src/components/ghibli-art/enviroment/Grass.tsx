import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertex from '../shader/grass.vert'
import fragment from '../shader/grass.frag'
import { useFrame } from '@react-three/fiber'
import { folder, useControls } from 'leva'

const PLANE_SIZE = 50
const BLADE_COUNT = 500000
const BLADE_WIDTH = 0.2
const BLADE_HEIGHT = 0.2
const BLADE_HEIGHT_VARIATION = 0.6

function convertRange(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}
function generateBlade(center: THREE.Vector3, vArrOffset: number, uv: number[]) {
  const MID_WIDTH = BLADE_WIDTH * 0.5
  const TIP_OFFSET = 0.1
  const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION

  const yaw = Math.random() * Math.PI * 2
  const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw))
  const tipBend = Math.random() * Math.PI * 2
  const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend))

  // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
  const bl = new THREE.Vector3().addVectors(
    center,
    new THREE.Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * 1),
  )
  const br = new THREE.Vector3().addVectors(
    center,
    new THREE.Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * -1),
  )
  const tl = new THREE.Vector3().addVectors(
    center,
    new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1),
  )
  const tr = new THREE.Vector3().addVectors(
    center,
    new THREE.Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1),
  )
  const tc = new THREE.Vector3().addVectors(center, new THREE.Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET))

  tl.y += height / 2
  tr.y += height / 2
  tc.y += height

  // Vertex Colors
  const black = [0, 0, 0]
  const gray = [0.5, 0.5, 0.5]
  const white = [1.0, 1.0, 1.0]

  const verts = [
    { pos: bl.toArray(), uv: uv, color: black },
    { pos: br.toArray(), uv: uv, color: black },
    { pos: tr.toArray(), uv: uv, color: gray },
    { pos: tl.toArray(), uv: uv, color: gray },
    { pos: tc.toArray(), uv: uv, color: white },
  ]

  const indices = [
    vArrOffset,
    vArrOffset + 1,
    vArrOffset + 2,
    vArrOffset + 2,
    vArrOffset + 4,
    vArrOffset + 3,
    vArrOffset + 3,
    vArrOffset,
    vArrOffset + 2,
  ]

  return { verts, indices }
}

const Grass = () => {
  const grassRef = useRef<THREE.Mesh>(null)
  const [grassTexture, cloudTexture] = useTexture(['/textures/test_1.jpg', '/textures/cloud.jpg'])
  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping

  // BufferGeometry
  const generateField = () => {
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    const colors: number[] = []

    for (let i = 0; i < BLADE_COUNT; i++) {
      const VERTEX_COUNT = 5
      const surfaceMin = (PLANE_SIZE / 2) * -1
      const surfaceMax = PLANE_SIZE / 2
      const radius = PLANE_SIZE / 2

      const r = radius * Math.sqrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const x = r * Math.cos(theta)
      const y = r * Math.sin(theta)

      const pos = new THREE.Vector3(x, 0, y)

      const uv = [convertRange(pos.x, surfaceMin, surfaceMax, 0, 1), convertRange(pos.z, surfaceMin, surfaceMax, 0, 1)]

      const blade = generateBlade(pos, i * VERTEX_COUNT, uv)
      blade.verts.forEach((vert) => {
        positions.push(...vert.pos)
        uvs.push(...vert.uv)
        colors.push(...vert.color)
      })
      blade.indices.forEach((indice) => indices.push(indice))
    }

    return {
      positions: new Float32Array(positions),
      uv: new Float32Array(uvs),
      colors: new Float32Array(colors),
      indices,
    }
  }
  const { indices, uv, colors, positions } = generateField()

  useEffect(() => {
    if (grassRef.current) {
      grassRef.current.geometry.setIndex(indices)
    }
  }, [indices])

  useFrame(({ clock }) => {
    const elapedTime = clock.getElapsedTime()
    if (grassRef.current) {
      ;(grassRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = elapedTime
    }
  })

  // Uniform modifiers
  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0),
      uTextures: new THREE.Uniform([grassTexture, cloudTexture]),
      uBrightness: new THREE.Uniform(0.2),
      uContrast: new THREE.Uniform(1.0),
    }),
    [cloudTexture, grassTexture],
  )

  const { brightness, contrast } = useControls({
    grass: folder({
      brightness: {
        value: 0.1,
        step: 0.1,
      },
      contrast: {
        value: 1.0,
        step: 0.1,
      },
    }),
  })

  useEffect(() => {
    uniforms.uBrightness.value = brightness
    uniforms.uContrast.value = contrast
  }, [brightness, contrast])

  return (
    <>
      <mesh ref={grassRef}>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' array={positions} itemSize={3} />
          <bufferAttribute attach='attributes-uv' array={uv} itemSize={2} />
          <bufferAttribute attach='attributes-color' array={colors} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          side={THREE.DoubleSide}
          vertexColors
        />
      </mesh>
    </>
  )
}

export default Grass
