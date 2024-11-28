import { RigidBody } from '@react-three/rapier'
import { Base, Geometry, Subtraction } from '@react-three/csg'
import { useTexture } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vertex from '../../shaders/terrain.vert'
import fragment from '../../shaders/terrain.frag'

const Terrain = () => {
  const heightMap = useTexture('/img/heightMap/ghibli.png')

  return (
    <RigidBody type='fixed' colliders='trimesh' ccd>
      <group>
        <mesh castShadow>
          <Geometry>
            <Base scale={[11, 2, 11]}>
              <boxGeometry />
            </Base>
            <Subtraction scale={[10, 2.1, 10]}>
              <boxGeometry />
            </Subtraction>
          </Geometry>
          <meshStandardMaterial color='#ffffff' metalness={0} roughness={0.3} />
        </mesh>
        <mesh rotation-x={-Math.PI * 0.5} receiveShadow castShadow>
          <planeGeometry args={[10, 10, 1, 1]} />
          <CustomShaderMaterial<typeof THREE.MeshStandardMaterial>
            baseMaterial={THREE.MeshStandardMaterial}
            metalness={0}
            roughness={0.5}
            vertexShader={vertex}
            fragmentShader={fragment}
            uniforms={{}}
          />
        </mesh>
      </group>
    </RigidBody>
  )
}

export default Terrain
