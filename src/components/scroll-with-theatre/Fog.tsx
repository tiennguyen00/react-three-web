import { useThree } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'

function Fog() {
  const { scene } = useThree()
  return <fog args={[new THREE.Color(0xffffff), 100]} />
}

Fog.propTypes = {}

export default Fog
