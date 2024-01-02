import { useFBO } from '@react-three/drei'
import { useFrame, createPortal, extend } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface FBOParticlesProps {
  renderMatParticles: Record<string, any>
  simGeoParticles: Record<string, any>
  particlesPosition: Float32Array
}

const FBOParticles = ({ renderMatParticles, simGeoParticles, particlesPosition }: FBOParticlesProps) => {
  // size
  const width = 512,
    height = 512

  // This reference gives us direct access to our points
  const refPoints = useRef<THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.ShaderMaterial>>()

  const renderTarget = useFBO(width, height, {
    minFilter: THREE.NearestFilter, // Important because we want to sample square pixels
    magFilter: THREE.NearestFilter,
    generateMipmaps: false, // No need
    colorSpace: THREE.SRGBColorSpace, // No need
    depthBuffer: false, // No need
    stencilBuffer: false, // No need
    format: THREE.RGBAFormat, // Or RGBAFormat instead (to have a color for each particle, for example)
    type: THREE.FloatType, // Important because we need precise coordinates (not ints)
  })

  // Create a camera and a scene for our FBO
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1)

  useFrame((state) => {
    const { gl, clock } = state

    // Set the current render target to our FBO
    gl.setRenderTarget(renderTarget)
    gl.clear()
    // Render the simulation material with square geometry in the render target
    gl.render(scene, camera)
    // Revert to the default render target
    gl.setRenderTarget(null)

    // Read the position data from the texture field of the render target
    // and send that data to the final shaderMaterial via the `uPositions` uniform
    if (refPoints.current) refPoints.current.material.uniforms.uPositions.value = renderTarget.texture
  })

  // Create a simple square geometry with custom uv and positions attributes
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0])
  const uv = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0])

  return (
    <>
      {/* Render off-screen our simulation material and square geometry */}
      {createPortal(
        <mesh>
          <bufferGeometry>
            <bufferAttribute attach='attributes-position' count={positions.length / 3} array={positions} itemSize={3} />
            <bufferAttribute attach='attributes-uv' count={uv.length / 2} array={uv} itemSize={2} />
          </bufferGeometry>
          <shaderMaterial args={[simGeoParticles]} />
        </mesh>,
        scene,
      )}
      <points ref={refPoints as any}>
        <bufferGeometry>
          <bufferAttribute
            attach='attributes-position'
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial args={[renderMatParticles]} />
      </points>
    </>
  )
}
export default FBOParticles
