import { lerp } from 'three/src/math/MathUtils'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import simVertex from './simVertext.vert'
import simFragment from './simFragment.frag'
import { useFBO, useTexture } from '@react-three/drei'
import vertexShader from './vertex.vert'
import fragmentShader from './fragment.frag'
import { useFrame, useThree } from '@react-three/fiber'
import { useScreen } from '@/utils/useScreen'

const Experience2 = () => {
  const size = 6,
    number = size * size
  const { width, height } = useScreen()
  const sceneFBO = useRef<THREE.Scene>(new THREE.Scene())
  const viewArea = size / 2 + 0.01
  const cameraFBO = useRef<THREE.OrthographicCamera>(
    new THREE.OrthographicCamera(-viewArea, viewArea, viewArea, -viewArea, -2, 2),
  )
  cameraFBO.current.position.z = 1
  cameraFBO.current.lookAt(new THREE.Vector3(0, 0, 0))
  const simMaterial = useRef<THREE.ShaderMaterial>(null!)
  const material = useRef<THREE.ShaderMaterial>(null!)
  const debugPlane = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null!)
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const { scene, camera, pointer } = useThree()
  const threejsLogoTexture = useTexture('/img/threejs-logo.png')

  const getPointsOnSphere = useMemo(() => {
    const data = new Float32Array(4 * number)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j

        // generate point on a sphere
        let theta = Math.random() * Math.PI * 2
        let phi = Math.acos(Math.random() * 2 - 1)
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

  const setUpFBO1 = useMemo(() => {
    // create data Texture
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
    positions.needsUpdate = true

    // create FBO scene
    const geo = new THREE.BufferGeometry()
    let pos = new Float32Array(number * 3)
    let uv = new Float32Array(number * 2)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const index = i * size + j

        pos[3 * index] = size * lerp(-0.5, 0.5, j / (size - 1))
        pos[3 * index + 1] = size * lerp(-0.5, 0.5, i / (size - 1))
        pos[3 * index + 2] = 0

        uv[2 * index] = j / (size - 1)
        uv[2 * index + 1] = i / (size - 1)
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))

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
    const simMesh = new THREE.Points(geo, simMaterial.current)
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
  const renderTargetRef = useRef({
    current: renderTargetA,
    next: renderTargetB,
  })

  useEffect(() => {
    const geometry = new THREE.BufferGeometry()
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
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    material.current = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        // uTexture: { value: new THREE.TextureLoader().load(texture) },
        uTexture: { value: setUpFBO1.positions },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    })

    const mesh = new THREE.Points(geometry, material.current)
    scene.add(mesh)

    debugPlane.current = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 1, 1),
      new THREE.MeshBasicMaterial({
        map: threejsLogoTexture,
      }),
    )
    scene.add(debugPlane.current)
  }, [])

  useEffect(() => {
    const planeMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30), new THREE.MeshBasicMaterial())
    const dummy = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshNormalMaterial())
    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / width) * 2 - 1
      pointer.y = -(e.clientY / height) * 2 + 1
      raycaster.current.setFromCamera(pointer, camera)

      const intersects = raycaster.current.intersectObjects([planeMesh])
      if (!simMaterial.current) return
      if (intersects.length > 0) {
        dummy.position.copy(intersects[0].point)
        simMaterial.current.uniforms.uMouse.value = intersects[0].point
      }
    }

    scene.add(dummy)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      scene.remove(dummy)
    }
  }, [camera, width, height, pointer, scene])

  useFrame((state) => {
    const { clock, gl } = state
    const elapsedTime = clock.getElapsedTime()

    gl.setRenderTarget(renderTargetRef.current.current)
    gl.render(sceneFBO.current, cameraFBO.current)
    gl.setRenderTarget(null)
    gl.render(scene, camera)

    const temp = renderTargetRef.current.current
    renderTargetRef.current.current = renderTargetRef.current.next
    renderTargetRef.current.next = temp

    material.current.uniforms.time.value = elapsedTime
    material.current.uniforms.uTexture.value = renderTargetRef.current.current.texture
    simMaterial.current.uniforms.uCurrentPosition.value = renderTargetRef.current.next.texture
    simMaterial.current.uniforms.uTime.value = elapsedTime

    if (debugPlane.current) {
      debugPlane.current.material.map = renderTargetRef.current.current.texture
    }
  })

  return <></>
}

export default Experience2
