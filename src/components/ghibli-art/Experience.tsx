import Character from './character'
import Brush from './enviroment/Brush'
import Grass from './enviroment/Grass'
import Light from './enviroment/Light'
import Terrain from './enviroment/Terrain'
import Trees from './enviroment/Trees'
import * as THREE from 'three'

const Experience = () => {
  return (
    <>
      <Light />
      {/* <Grass /> */}
      <Terrain />
      <Character />
      <Brush />
      {/* <Trees
        position={[0, 2, 0]}
        colors={[
          new THREE.Color('#427062').convertLinearToSRGB(),
          new THREE.Color('#33594e').convertLinearToSRGB(),
          new THREE.Color('#234549').convertLinearToSRGB(),
          new THREE.Color('#1e363f').convertLinearToSRGB(),
        ]}
      /> */}
    </>
  )
}

export default Experience
