import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/plane/plane.vert'
import fragment from '@/components/shared/plane/plane.frag'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const Plane = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const textture = useTexture('/img/wlop-art.png')

  useEffect(() => {
    if (!meshRef.current) return
    const geometry = meshRef.current.geometry
    const aRandom = new Float32Array(geometry.attributes.position.count)
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      aRandom[i] = Math.random()
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1))
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const elapsedTime = clock.getElapsedTime()
    const mateial = meshRef.current.material as THREE.ShaderMaterial
    mateial.uniforms.uTime.value = elapsedTime
  })

  return (
    <>
      <mesh ref={meshRef} scale={[1, 2 / 3, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          side={THREE.DoubleSide}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={{
            uFrequency: { value: new THREE.Vector2(10, 5) },
            uTime: { value: 0 },
            uTexture: { value: textture },
          }}
        />
      </mesh>
      {/* <mesh position={[0, 1, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color='0xffffff' side={THREE.DoubleSide} />
      </mesh> */}
    </>
  )
}

export default Plane
