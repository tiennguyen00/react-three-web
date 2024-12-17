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
      <Brush />
      {/* <Terrain /> */}
      {/* <Character /> */}
    </>
  )
}

export default Experience
