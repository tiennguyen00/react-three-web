'use client'
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect } from 'react'
import * as THREE from 'three'

const HermitModels = () => {
  const { scene } = useGLTF('/models/smith/LeePerrySmith.glb')
  const [colorMap, normalMap] = useTexture(['/models/smith/color.jpg', '/models/smith/normal.jpg'])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMapIntensity = 1
        child.material.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
        colorMap.colorSpace = THREE.SRGBColorSpace

        const material = new THREE.MeshStandardMaterial({
          map: colorMap,
          normalMap: normalMap,
        })
        child.material = material

        material.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
             #include <common>
             mat2 get2dRotateMatrix(float _angle)
              {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
              }
            `,
          )

          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
              #include <begin_vertex>
              float angle = position.y * 0.9;
              mat2 rotateMatrix = get2dRotateMatrix(angle);
              transformed.xz = rotateMatrix * transformed.xz;

            `,
          )
        }
      }
    })
  }, [scene, colorMap, normalMap])

  return (
    <mesh rotation-y={Math.PI * 0.5}>
      <primitive object={scene} />
    </mesh>
  )
}

const page = () => {
  return (
    <Canvas
      id='canvas-custom-materials'
      shadows
      camera={{
        position: [8, 8, 8],
      }}
      dpr={[1, 2]}
    >
      {/* <axesHelper /> */}
      <directionalLight
        color='#ffffff'
        intensity={3}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
        shadow-normalBias={0.05}
        position={[0.25, 2, -2.25]}
      />
      <ambientLight intensity={0.5} />
      <OrbitControls />

      <Suspense fallback={null}>
        <Environment
          background
          files={['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']}
          path='/img/enviroments/'
        />
        <HermitModels />
      </Suspense>
    </Canvas>
  )
}

export default page
