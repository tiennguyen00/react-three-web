import { CycleRaycast, useFBO } from '@react-three/drei'
import { useEffect, useCallback, useMemo, useRef } from 'react'
import * as THREE from 'three'
import vertexShader from './vertex.vert'
import fragmentShader from './fragment.frag'
import simVertex from './simVertex.vert'
import simFragment from './simFragment.frag'
import { useFrame, useThree } from '@react-three/fiber'
import { useScreen } from '@/utils/useScreen'
function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b
}

const Experience = () => {
  const { camera, pointer, scene } = useThree()
  const { width, height } = useScreen()
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const shaderMaterial = useRef<THREE.ShaderMaterial>(null!)
  const sceneFBO = useRef<THREE.Scene>(new THREE.Scene())
  const cameraFBO = useRef<THREE.OrthographicCamera>(new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2))
  cameraFBO.current.position.z = 1
  cameraFBO.current.lookAt(new THREE.Vector3(0, 0, 0))

  const simMaterial = useRef<THREE.ShaderMaterial>(null!)
  const size = 512,
    number = size * size

  let getPointsOnSphere = useMemo(() => {
    const data = new Float32Array(4 * number)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j

        // generate point on a sphere
        let theta = Math.random() * Math.PI * 2
        let phi = Math.acos(Math.random() * 2 - 1) //
        // let phi = Math.random() * Math.PI //
        let x = Math.sin(phi) * Math.cos(theta)
        let y = Math.sin(phi) * Math.sin(theta)
        let z = Math.cos(phi)

        data[4 * index] = x
        data[4 * index + 1] = y
        data[4 * index + 2] = z
        data[4 * index + 3] = (Math.random() - 0.5) * 0.01
      }
    }

    let dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
    dataTexture.needsUpdate = true

    return { dataTexture }
  }, [])

  const setUpFBO = useMemo(() => {
    const data = new Float32Array(4 * number)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j
        data[4 * index] = lerp(-0.5, 0.5, j / (size - 1))
        data[4 * index + 1] = lerp(-0.5, 0.5, i / (size - 1))
        data[4 * index + 2] = 0
        data[4 * index + 3] = 1
      }
    }
    const positions = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)

    // create FBO scene
    cameraFBO.current.position.z = 1
    cameraFBO.current.lookAt(new THREE.Vector3(0, 0, 0))
    const geo = new THREE.PlaneGeometry(2, 2, 2, 2)

    simMaterial.current = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uCurrentPosition: { value: getPointsOnSphere.dataTexture },
        uOriginalPosition: { value: getPointsOnSphere.dataTexture },
        uOriginalPosition1: { value: getPointsOnSphere.dataTexture },
      },
      vertexShader: simVertex,
      fragmentShader: simFragment,
    })
    simMaterial.current.needsUpdate = true
    const simMesh = new THREE.Mesh(geo, simMaterial.current)
    sceneFBO.current.add(simMesh)

    return { positions }
  }, [getPointsOnSphere])

  const renderTargetA = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })
  const renderTargetB = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  // Store which render target is current with a ref
  const renderTargetRef = useRef({
    current: renderTargetA,
    next: renderTargetB,
  })

  const { positions, uvs } = useMemo(() => {
    const positions = new Float32Array(number * 3)
    const uvs = new Float32Array(number * 2)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j

        positions[3 * index] = j / size - 0.5
        positions[3 * index + 1] = i / size - 0.5
        positions[3 * index + 2] = 0
        uvs[2 * index] = j / (size - 1)
        uvs[2 * index + 1] = i / (size - 1)
      }
    }

    return { positions, uvs }
  }, [])

  useFrame((state) => {
    const { clock, gl, scene, camera } = state

    // Use the current render target from our ref
    gl.setRenderTarget(renderTargetRef.current.current)
    gl.render(sceneFBO.current, cameraFBO.current)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    // Swap render targets in our ref
    const temp = renderTargetRef.current.current
    renderTargetRef.current.current = renderTargetRef.current.next
    renderTargetRef.current.next = temp

    if (shaderMaterial.current) {
      shaderMaterial.current.uniforms.time.value = clock.getElapsedTime()
      shaderMaterial.current.uniforms.uTexture.value = renderTargetRef.current.current.texture
    }
    if (simMaterial.current) {
      simMaterial.current.uniforms.uCurrentPosition.value = renderTargetRef.current.next.texture
      simMaterial.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  useEffect(() => {
    const planeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 30, 30),
      new THREE.MeshBasicMaterial({ visible: false }),
    )
    const dummy = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshNormalMaterial())
    scene.add(planeMesh)
    scene.add(dummy)

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / width) * 2 - 1
      pointer.y = -(e.clientY / height) * 2 + 1
      raycaster.current.setFromCamera(pointer, camera)

      const intersects = raycaster.current.intersectObjects([planeMesh])
      if (intersects.length > 0) {
        dummy.position.copy(intersects[0].point)
        if (simMaterial.current) simMaterial.current.uniforms.uMouse.value = intersects[0].point
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      scene.remove(planeMesh)
      scene.remove(dummy)
    }
  }, [camera, width, height, pointer, scene])

  return (
    <>
      {/* <CycleRaycast
        preventDefault={true} // Call event.preventDefault() (default: true)
        scroll={true} // Wheel events (default: true)
        keyCode={9} // Keyboard events (default: 9 [Tab])
        onChanged={(objects, cycle) => console.log(objects, cycle)} // Optional onChanged event
      /> */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach='attributes-uv' count={uvs.length / 2} array={uvs} itemSize={2} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderMaterial}
          uniforms={{
            time: new THREE.Uniform(0),
            uTexture: new THREE.Uniform(setUpFBO.positions),
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          depthTest={false}
          depthWrite={false}
          transparent
          needsUpdate={true}
        />
      </points>
    </>
  )
}

export default Experience
