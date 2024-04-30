import { Helper, useHelper } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { BoxHelper, DirectionalLight, DirectionalLightHelper } from 'three'

type Props = {}

const Light = (props: Props) => {
  const dirRef = useRef<DirectionalLight>(null)
  useHelper(dirRef, DirectionalLightHelper, 5, 'red')

  return (
    <mesh>
      <hemisphereLight
        color={new THREE.Color().setHSL(0.6, 1, 0.6)}
        groundColor={new THREE.Color().setHSL(0.095, 1, 0.75)}
        position={[0, 10, 0]}
        intensity={2}
      />
      <directionalLight
        ref={dirRef}
        color={new THREE.Color().setHSL(0.1, 1, 0.95)}
        position={new THREE.Vector3(-1, 1.75, 1).multiplyScalar(20)}
        castShadow
        // shadow={{
        //   mapSize: {
        //     width: 2048,
        //     height: 2048,
        //   },
        // }}
      />
      {/* <Helper type={DirectionalLightHelper} args={[5, 'red']} /> */}
    </mesh>
  )
}

export default Light
