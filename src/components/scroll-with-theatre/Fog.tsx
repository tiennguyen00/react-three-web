import { useThree } from '@react-three/fiber'
import React from 'react'

function Fog() {
  const { scene } = useThree()
  return <fog args={[scene.background as any, 0.1, 100]} />
}

Fog.propTypes = {}

export default Fog
