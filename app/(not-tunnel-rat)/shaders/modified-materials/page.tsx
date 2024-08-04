'use client'
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import vertexShader from '@/templates/Shader/glsl/particles-simulation.vert'

const HermitModels = () => {
  const { scene } = useGLTF('/models/smith/LeePerrySmith.glb')
  const [colorMap, normalMap] = useTexture(['/models/smith/color.jpg', '/models/smith/normal.jpg'])

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    [],
  )

  const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
  })

  useEffect(() => {
    scene.children[0].customDepthMaterial = depthMaterial

    // using for custom the shadow code
    depthMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
             #include <common>
             uniform float uTime;
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
              float angle = (sin(position.y + uTime)) * 0.4;
              mat2 rotateMatrix = get2dRotateMatrix(angle);
              transformed.xz = rotateMatrix * transformed.xz;

            `,
      )
      shader.uniforms.uTime = uniforms.uTime
    }

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

        child.material.onBeforeCompile = (shader) => {
          console.log('vertexShader: ', shader.vertexShader)

          shader.vertexShader = shader.vertexShader.replace(
            '#include <common>',
            `
             #include <common>
             uniform float uTime;
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
              transformed.xz = rotateMatrix * transformed.xz;

            `,
          )

          shader.vertexShader = shader.vertexShader.replace(
            '#include <beginnormal_vertex>',
            `
              #include <beginnormal_vertex>
              float angle = (sin(position.y + uTime)) * 0.4;
              mat2 rotateMatrix = get2dRotateMatrix(angle);
              objectNormal.xz = rotateMatrix * objectNormal.xz;
            `,
          )

          shader.uniforms.uTime = uniforms.uTime
        }
      }
    })
  }, [scene, colorMap, normalMap, uniforms.uTime])

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime()
    uniforms.uTime.value = elapsedTime
  })

  return (
    <>
      <group rotation-y={Math.PI * 0.5}>
        <primitive object={scene} />
      </group>
      <mesh receiveShadow rotation-y={Math.PI} position={[0, -5, 5]}>
        <planeGeometry args={[15, 15, 15]} />
        <meshStandardMaterial />
      </mesh>
    </>
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
      <axesHelper />
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
