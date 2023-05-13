import { Clone, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function getRandomArbitrary(min: number, max: number) {
  if (Math.random() < 0.5) return Math.random() * (max - min) + min;
  return Math.random() * (max - min) - max;
}

const Pumpkin = () => {
  const nodes = useGLTF("/models/demon_pumpkin.glb");

  return (
    <>
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
        rotation-y={2 * Math.PI * Math.random()}
      />
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
        rotation-y={2 * Math.PI * Math.random()}
      />
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
        rotation-y={2 * Math.PI * Math.random()}
      />
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
      />
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
        rotation-y={2 * Math.PI * Math.random()}
      />
      <Clone
        object={nodes.scene}
        scale={0.01}
        position={
          new THREE.Vector3(
            getRandomArbitrary(-5, 9),
            0,
            getRandomArbitrary(-5, 9)
          )
        }
        rotation-y={2 * Math.PI * Math.random()}
      />
    </>
  );
};

export default Pumpkin;
