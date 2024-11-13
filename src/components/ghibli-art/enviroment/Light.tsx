import React from 'react'

const Light = () => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        color='white'
        position={[15, 15, 15]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  )
}

export default Light
