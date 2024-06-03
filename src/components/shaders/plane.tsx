import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import vertex from '@/components/shared/plane/plane.vert'
import fragment from '@/components/shared/plane/plane.frag'

const Plane = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  useEffect(() => {
    if (!meshRef.current) return
    const geometry = meshRef.current.geometry
    const aRandom = new Float32Array(geometry.attributes.position.count)
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      aRandom[i] = Math.random()
    }

    geometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1))
  }, [])

  return (
    <>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial side={THREE.DoubleSide} vertexShader={vertex} fragmentShader={fragment} />
      </mesh>
      {/* <mesh position={[0, 1, 1]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color='0xffffff' side={THREE.DoubleSide} />
      </mesh> */}
    </>
  )
}

export default Plane
