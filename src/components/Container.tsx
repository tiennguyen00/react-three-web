import House from "./House";
import Switches from "./Switches";
import * as THREE from "three";
import {Ref} from "react";
import {useControls} from "leva";
import CameraControlCurve from "./utils/CameraControlCurve";
import CameraControlFamer, {
  targetLookAt,
  targetPosition,
} from "./utils/CameraControlFamer";
import {StylizedAirPlane} from "./models/StylizedAirPlane";

interface ContainerProps {
  refSwitch: Ref<THREE.Group> | undefined;
  refCastle: Ref<THREE.Group> | undefined;
  setOnGreetAniComplete: (v: boolean) => void;
}

const Container = ({
  refSwitch,
  refCastle,
  setOnGreetAniComplete,
}: ContainerProps) => {
  // const {position} = useControls({
  //   position: {
  //     value: [0, 0, 0],
  //     step: 0.5,
  //   },
  // });

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

  return (
    <>
      {/* <CameraControlFamer setOnGreetAniComplete={setOnGreetAniComplete} /> */}
      {/* {targetLookAt.map((i, idx) => (
        <mesh key={idx} position={new THREE.Vector3(...i)}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      ))} */}

      {/* <CameraControlCurve /> */}

      {/* <Switches
        props={{
          position: new THREE.Vector3(0, 0, 8),
          scale: 0.5,
          ref: refSwitch,
        }}
      /> */}
      {/* <StylizedAirPlane position={new THREE.Vector3(...targetLookAt[2])} /> */}
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
