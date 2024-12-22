import { RigidBody } from '@react-three/rapier'
import { Base, Geometry, Subtraction } from '@react-three/csg'
import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialVanilla from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'
import vertex from '../../shaders/terrain.vert'
import fragment from '../../shaders/terrain.frag'
import { useEffect, useMemo, useRef } from 'react'
import { useControls } from 'leva'
import { useGLTF, useTexture } from '@react-three/drei'
import { useTerrainGeometry } from '@/store'
import { PLANE_SIZE } from './Grass'

const PLANE_SIZE_1 = 50

const Terrain = () => {
  const planeRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uPositionFrequency: new THREE.Uniform(0.2),
      uStrength: new THREE.Uniform(2.0),
      uWarpFrequency: new THREE.Uniform(5),
      uWarpStrength: new THREE.Uniform(0.5),
    }),
    [],
  )

  const { positionFrequency, strengh, warpFrequency, warpStrength } = useControls('Terrain', {
    positionFrequency: {
      value: 0.09,
    },
    strengh: {
      value: 2.0,
    },
    warpFrequency: {
      value: 3.0,
    },
    warpStrength: {
      value: 0.0,
    },
  })

  useEffect(() => {
    if (planeRef.current) {
      planeRef.current.geometry.rotateX(-Math.PI * 0.5)
    }
  }, [])

  useEffect(() => {
    const material = planeRef.current?.material as THREE.ShaderMaterial
    material.uniforms.uPositionFrequency.value = positionFrequency
    material.uniforms.uStrength.value = strengh
    material.uniforms.uWarpFrequency.value = warpFrequency
    material.uniforms.uWarpStrength.value = warpStrength
  }, [positionFrequency, strengh, warpFrequency, warpStrength])

  return (
    <group>
      <mesh castShadow>
        <Geometry>
          <Base scale={[PLANE_SIZE_1 + 1, 2, PLANE_SIZE_1 + 1]}>
            <boxGeometry />
          </Base>
          <Subtraction scale={[PLANE_SIZE_1, 2.1, PLANE_SIZE_1]}>
            <boxGeometry />
          </Subtraction>
        </Geometry>
        <meshStandardMaterial color='#ffffff' metalness={0} roughness={0.3} />
      </mesh>
      <mesh
        ref={planeRef}
        receiveShadow
        castShadow
        customDepthMaterial={
          new CustomShaderMaterialVanilla<typeof THREE.MeshDepthMaterial>({
            vertexShader: vertex,
            baseMaterial: THREE.MeshDepthMaterial,
            uniforms: uniforms,
            depthPacking: THREE.RGBADepthPacking,
          })
        }
      >
        <planeGeometry args={[PLANE_SIZE_1, PLANE_SIZE_1, PLANE_SIZE_1 * 10, PLANE_SIZE_1 * 10]} />
        <CustomShaderMaterial<typeof THREE.MeshStandardMaterial>
          baseMaterial={THREE.MeshStandardMaterial}
          metalness={0}
          roughness={0.5}
          color='#85d534'
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  )
}

const Terrain2 = () => {
  const roughPlane = useGLTF('/models/rough-plane.glb')
  const { setData } = useTerrainGeometry()

  useEffect(() => {
    setData(roughPlane.nodes.roughPlan.geometry)
    // Receive Shadows
    roughPlane.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.receiveShadow = true
      }
    })
  }, [])

  return (
    <RigidBody type='fixed' colliders='trimesh'>
      <group scale={5} position={[0, -1.2, 0]}>
        <primitive object={roughPlane.scene} />
      </group>
    </RigidBody>
  )
}

const Terrain3 = () => {
  const { setData } = useTerrainGeometry()
  const heightMap = useTexture('/img/heightMap/1.png')

  useEffect(() => {
    if (!heightMap) return
    heightMap.wrapS = heightMap.wrapT = THREE.RepeatWrapping
    setData(heightMap)
  }, [heightMap])

  return (
    <RigidBody type='fixed' colliders='trimesh'>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.5}>
        <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 512, 512]} />
        <meshStandardMaterial color={'gray'} displacementMap={heightMap} displacementScale={4} />
      </mesh>
    </RigidBody>
  )
}

export default Terrain3
