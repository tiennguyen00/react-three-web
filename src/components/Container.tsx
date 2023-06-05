import { extend, useFrame, useThree } from "@react-three/fiber";
import House from "./House";
import Switches from "./Switches";
import * as THREE from "three";
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScroll } from "@react-three/drei";
import { useControls } from "leva";
import { LayoutCamera } from "framer-motion-3d";
import {
  BoxGeometry,
  Fog,
  Mesh,
  MeshStandardMaterial,
  SpotLight,
  HemisphereLight,
  AmbientLight,
  Group,
  PlaneGeometry,
} from "three";
import CameraControl from "./utils/CameraControl";

extend({
  MeshStandardMaterial,
  BoxGeometry,
  Mesh,
  Fog,
  SpotLight,
  HemisphereLight,
  AmbientLight,
  Group,
  PlaneGeometry,
});

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

  console.log("reredner");

  return (
    <>
      <CameraControl setOnGreetAniComplete={setOnGreetAniComplete} />
      {/* {targetLookAt.map((i, idx) => (
        <mesh key={idx} position={new THREE.Vector3(...i)}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      ))} */}

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
