import { useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { DirectionalLight, DirectionalLightHelper } from 'three'

const Light = () => {
  const dirRef = useRef<DirectionalLight>(null)

  useHelper(dirRef, DirectionalLightHelper, 5, 'white')

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        ref={dirRef}
        color='white'
        position={[15, 15, 15]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
    </>
  )
}

export default Light
