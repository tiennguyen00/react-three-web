import { Instance, Instances, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const PLANE_COUNT = 200
const BRUSH_COUNT = 50
const Brush = () => {
  const alphaMap = useTexture('/img/alphaMap/brush.png')

  const { geometries, planes } = useMemo(() => {
    const planes: THREE.PlaneGeometry[] = []
    for (let i = 0; i < PLANE_COUNT; i++) {
      const plane = new THREE.PlaneGeometry(1, 1)
      planes.push(plane)

      const spherial = new THREE.Spherical(
        1 - Math.pow(Math.random(), 3),
        Math.PI * 2 * Math.random(),
        Math.PI * Math.random(),
      )

      const position = new THREE.Vector3().setFromSpherical(spherial)
      plane.rotateX(Math.random() * 9999)
      plane.rotateY(Math.random() * 9999)
      plane.rotateZ(Math.random() * 9999)
      plane.translate(position.x, position.y, position.z)

      // Normal
      const normal = position.clone().normalize()
      const normalArray = new Float32Array(12)
      for (let i = 0; i < 4; i++) {
        const i3 = i * 3
        const position = new THREE.Vector3(
          plane.attributes.position.array[i3],
          plane.attributes.position.array[i3 + 1],
          plane.attributes.position.array[i3 + 2],
        )

        const mixedNormal = position.lerp(normal, 0.4)
        normalArray[i3] = mixedNormal.x
        normalArray[i3 + 1] = mixedNormal.y
        normalArray[i3 + 2] = mixedNormal.z
      }

      plane.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3))
    }

    const geometries = mergeGeometries(planes)

    return {
      geometries,
      planes,
    }
  }, [])
  return (
    <Instances
      material={
        new THREE.MeshPhongMaterial({
          color: '#427062',
          alphaMap,
          transparent: true,
          depthWrite: false,
        })
      }
      geometry={geometries}
    >
      {Array.from(Array(BRUSH_COUNT)).map((i, index) => (
        <Instance key={index} position={[(Math.random() * 2 - 1) * 10 - 1, 2, (Math.random() * 2 - 1) * 10]} />
      ))}
    </Instances>
  )
}

export default Brush
