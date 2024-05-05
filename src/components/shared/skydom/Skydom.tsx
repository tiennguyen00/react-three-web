import React from 'react'
import vertex from 'raw-loader!./skydom.vert'
import fragment from 'raw-loader!./skydom.frag'
import * as THREE from 'three'

const Skydom = () => {
  return (
    <mesh>
      <sphereGeometry args={[400, 32, 15]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          topColor: { value: new THREE.Color(0x0077ff) },
          bottomColor: { value: new THREE.Color(0xffffff) },
          offset: { value: 33 },
          exponent: { value: 0.6 },
        }}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

export default Skydom
