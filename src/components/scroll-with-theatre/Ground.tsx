import React from 'react'
import * as THREE from 'three'

type Props = {}

const Ground = (props: Props) => {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2}>
      <planeGeometry args={[100, 100]} />
      <meshLambertMaterial color={new THREE.Color('white').setHSL(0.095, 1, 0.75)} />
    </mesh>
  )
}

export default Ground
