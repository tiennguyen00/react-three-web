import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Switches = ({ props }: { props?: THREE.Group }) => {
  const models = useGLTF("/models/witch_journey/scene.gltf");
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(0, 4.5, 0));
  }, []);

  return (
    <group {...props}>
      <primitive object={models.scene} />
    </group>
  );
};

export default Switches;
