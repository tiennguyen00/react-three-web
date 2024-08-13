import { useState } from 'react'
import * as THREE from 'three'

const useParticleCursor = () => {
  const [textureCanvas, setTextureCanvas] = useState<THREE.CanvasTexture>()
  const [canvasCursor, setCanvasCursor] = useState(new THREE.Vector2(9999, 9999))

  return {
    textureCanvas,
    setTextureCanvas,
    canvasCursor,
    setCanvasCursor,
  }
}

export default useParticleCursor
