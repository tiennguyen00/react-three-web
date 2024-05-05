import { Helper, useHelper } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DirectionalLight, DirectionalLightHelper, HemisphereLight } from 'three'

type Props = {}

const Light = (props: Props) => {
  const dirRef = useRef<DirectionalLight>(null)
  const hemisRef = useRef<HemisphereLight>(null)

  useHelper(dirRef, DirectionalLightHelper, 5, 'red')
  useHelper(hemisRef, THREE.HemisphereLightHelper, 5, 'blue')

  return (
    <mesh>
      <hemisphereLight
        ref={hemisRef}
        color={new THREE.Color().setHSL(0.6, 1, 0.6)}
        groundColor={new THREE.Color().setHSL(0.095, 1, 0.75)}
        position={[0, 20, 0]}
        intensity={2}
      />
      <directionalLight
        ref={dirRef}
        color={new THREE.Color().setHSL(0.1, 1, 0.95)}
        position={new THREE.Vector3(-1, 1.75, 1).multiplyScalar(20)}
        castShadow
        // shadow={{
        //   mapSize: new THREE.Vector2(2048, 2048),
        // }}
      />
      {/* <Helper type={DirectionalLightHelper} args={[5, 'red']} /> */}
    </mesh>
  )
}

export default Light
