import { useFrame, useThree } from "@react-three/fiber";
import House from "./House";
import Switches from "./Switches";
import * as THREE from "three";
import { Ref } from "react";
import { useScroll } from "@react-three/drei";

interface ContainerProps {
  refSwitch: Ref<THREE.Group> | undefined;
  refCastle: Ref<THREE.Group> | undefined;
}

const Container = ({ refSwitch, refCastle }: ContainerProps) => {
  const { camera } = useThree();
  const scroll = useScroll();

  useFrame(() => {
    camera.lookAt(new THREE.Vector3());

    if (scroll.offset === 0)
      camera.position.lerp(new THREE.Vector3(0.18, 0.5, 10.8), 0.05);
    else {
      camera.position.set(
        Math.sin(scroll.offset * Math.PI * 2) * 10.8,
        camera.position.y,
        Math.cos(scroll.offset * Math.PI * 2) * 10.8
      );
    }
  });

  return (
    <>
      <Switches
        props={{
          position: new THREE.Vector3(0, 0, 8),
          scale: 0.5,
          ref: refSwitch,
        }}
      />
      <House
        props={{
          scale: 8,
          rotation: [0, Math.PI * 0.5, 0],
          ref: refCastle,
        }}
      />
    </>
  );
};

export default Container;
