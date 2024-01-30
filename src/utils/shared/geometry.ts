import * as THREE from "three"

export const getModelGeometry = (nodes: {
    [name: string]: THREE.Object3D<THREE.Object3DEventMap>;
}) => {
  let mergedVertices: number[] = []

    // Traverse the loaded nodes and collect vertices
    Object.keys(nodes).forEach((key) => {
      const node = nodes[key]
      if ((<any> node).geometry) {
        const positionAttribute = (<any> node).geometry.attributes.position
        const vertices = positionAttribute.array
        mergedVertices = mergedVertices.concat(Array.from(vertices))
      }
    })
    

    // Create a new geometry with the collected vertices
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(mergedVertices, 3))

    return geometry
}