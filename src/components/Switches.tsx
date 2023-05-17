import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Switches = ({ props }: { props?: GroupProps }) => {
  const models = useGLTF("/models/witch_journey/scene.gltf");
  const mixer = new THREE.AnimationMixer(models.scene);

  models.animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
  });

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <group {...props}>
      <primitive object={models.scene} />
    </group>
  );
};

export default Switches;
