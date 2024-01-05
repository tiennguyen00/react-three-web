
import * as THREE from "three"

export const getTexture = (g: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
  const size = g.attributes.position.count
  const texWidth = Math.ceil(Math.sqrt(size))
  const texHeight = Math.ceil(size / texWidth)

  let data = new Float32Array(texWidth * texHeight * 4)

  function shuffleArrayByThree(array: THREE.TypedArray) {
    const groupLength = 3

    let numGroups = Math.floor(array.length / groupLength)

    for (let i = numGroups - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      for (let k = 0; k < groupLength; k++) {
        let temp = array[i * groupLength + k]
        array[i * groupLength + k] = array[j * groupLength + k]
        array[j * groupLength + k] = temp
      }
    }

    return array
  }

  shuffleArrayByThree(g.attributes.position.array)

  for (let i = 0; i < size; i++) {
    //let f = Math.floor(Math.random() * (randomTemp.length / 3) );

    const red = g.attributes.position.array[i * 3 + 0]
    const green = g.attributes.position.array[i * 3 + 1]
    const blue = g.attributes.position.array[i * 3 + 2]
    const alpha = 0

    //randomTemp.splice(f * 3, 3);

    data[i * 4 + 0] = red
    data[i * 4 + 1] = green
    data[i * 4 + 2] = blue
    data[i * 4 + 3] = alpha
  }

  let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType)
  dataTexture.needsUpdate = true

  return dataTexture
}