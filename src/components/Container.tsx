import { useFrame, useThree } from "@react-three/fiber";
import House from "./House";
import Switches from "./Switches";
import * as THREE from "three";
import { Ref, useRef } from "react";
import { useScroll } from "@react-three/drei";
import { useControls } from "leva";

interface ContainerProps {
  refSwitch: Ref<THREE.Group> | undefined;
  refCastle: Ref<THREE.Group> | undefined;
}

const initedPosition = [0.18, 0.5, 10.8];

const targetPosition = [
  initedPosition,
  [-6, 1.5, 8],
  [10, 3.5, 8.5],
  [2.5, 2, 4],
  [2.5, 5.5, 5.5],
  [-9.5, 3, -3],
];

const targetLookAt = [
  [0, 0, 0],
  [-4, 0.5, 5.5],
  [8, 2.5, 6.5],
  [2.5, 2, 1],
  [2.5, 5, 2.5],
  [-6, 2, -3],
];

const Container = ({ refSwitch, refCastle }: ContainerProps) => {
  const { camera } = useThree();
  const scroll = useScroll();

  const { position } = useControls({
    position: {
      value: [0, 0, 0],
      step: 0.5,
    },
  });

  function interpolatePoints(time: number, array: number[][]) {
    const t = Math.min(Math.max(time, 0), 1); // Clamp time between 0 and 1
    const segments = array.length - 1;
    const index = t * segments;
    const segmentIndex = Math.floor(index);
    const alpha = index - segmentIndex;

    const p0 = array[segmentIndex];
    const p1 = array[segmentIndex + 1];

    const interpolatedPoint = [
      p0[0] + alpha * (p1[0] - p0[0]),
      p0[1] + alpha * (p1[1] - p0[1]),
      p0[2] + alpha * (p1[2] - p0[2]),
    ];

    return interpolatedPoint;
  }

  useFrame(() => {
    camera.lookAt(new THREE.Vector3());

    if (scroll.offset === 0)
      camera.position.lerp(new THREE.Vector3(...initedPosition), 0.05);
    else {
      camera.position.set(
        interpolatePoints(scroll.offset - 0.0001, targetPosition)[0],
        interpolatePoints(scroll.offset - 0.0001, targetPosition)[1],
        interpolatePoints(scroll.offset - 0.0001, targetPosition)[2]
      );

      camera.lookAt(
        new THREE.Vector3(
          ...interpolatePoints(scroll.offset - 0.0001, targetLookAt)
        )
      );
    }
  });

  return (
    <>
      {targetLookAt.map((i, idx) => (
        <mesh key={idx} position={new THREE.Vector3(...i)}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}

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
