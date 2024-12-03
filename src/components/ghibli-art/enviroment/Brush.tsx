import { Instance, Instances, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const PLANE_COUNT = 500
const BRUSH_COUNT = 50
const Brush = () => {
  const alphaMap = useTexture('/img/alphaMap/brush.png')
  const matcap = useTexture('/img/matcaps/brush.png')
  matcap.colorSpace = THREE.SRGBColorSpace

  const { geometries, planes } = useMemo(() => {
    const planes: THREE.PlaneGeometry[] = []
    for (let i = 0; i < PLANE_COUNT; i++) {
      const plane = new THREE.PlaneGeometry(1, 1)
      planes.push(plane)

      const spherial = new THREE.Spherical(
        1 - Math.pow(Math.random(), 3),
        (Math.PI / 2) * Math.random(),
        2 * Math.PI * Math.random(),
      )

      const position = new THREE.Vector3().setFromSpherical(spherial)
      plane.rotateX(Math.random() * 9999)
      plane.rotateY(Math.random() * 9999)
      plane.rotateZ(Math.random() * 9999)
      plane.translate(position.x, position.y - Math.PI / 2 + 0.0001, position.z)

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

  const instanceMeshRef = useRef<THREE.InstancedMesh>(null)
  const perlinTexture = useTexture('/img/perlin.png')
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uNoise: {
        value: perlinTexture,
      },
    }),
    [],
  )

  useEffect(() => {
    if (instanceMeshRef.current) {
      instanceMeshRef.current.material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          uniform sampler2D uNoise;
          uniform float uTime;
          varying vec3 vPositionWorld; 
          varying vec3 vPositionLocal; 
          #include <common>
          `,
        )
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          // Compute world position
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vPositionWorld = worldPosition.xyz;
          vPositionLocal = position;

          // Compute Perlin noise-based wind effect
          vec2 perlinUv = vPositionWorld.xz * 0.3 + vec2(sin(uTime) * 0.2);
          vec4 perlinSample = texture2D(uNoise, perlinUv);
          float perlinColor = (perlinSample.r - 0.5) * vPositionLocal.y;

          // Final position
          transformed.xz += vec2(perlinColor);
        `,
        )
        shader.uniforms.uNoise = uniforms.uNoise
        shader.uniforms.uTime = uniforms.uTime
      }
    }
  }, [instanceMeshRef])

  useFrame(({ _, clock }) => {
    const eslapedTime = clock.getElapsedTime()
    uniforms.uTime.value = eslapedTime
  })

  return (
    <Instances
      material={
        new THREE.MeshMatcapMaterial({
          matcap,
          alphaMap,
          transparent: true,
          depthWrite: true,
          blending: THREE.NormalBlending,
          alphaTest: 0.5,
          color: new THREE.Color().setHex(0xffffff),
        })
      }
      geometry={geometries}
      ref={instanceMeshRef}
    >
      {Array.from(Array(BRUSH_COUNT)).map((i, index) => (
        <Instance key={index} position={[(Math.random() * 2 - 1) * 10 - 1, 2, (Math.random() * 2 - 1) * 10]} />
      ))}
    </Instances>
  )
}

export default Brush
