import { useState } from 'react'

const useParticleCursor = () => {
  const [textureCanvas, setTextureCanvas] = useState<THREE.CanvasTexture>()

  return {
    textureCanvas,
    setTextureCanvas,
  }
}

export default useParticleCursor
