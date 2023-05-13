import { useGLTF } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const Switches = ({ props }: { props?: GroupProps }) => {
  const models = useGLTF("/models/witch_journey/scene.gltf");
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(-2, 5, 0));
  }, []);

  return (
    <group {...props}>
      <primitive object={models.scene} />
    </group>
  );
};

export default Switches;
