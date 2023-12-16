import {useMemo} from "react";
import * as THREE from "three";
import {targetPosition} from "./CameraControlFamer";
import {Line, PerspectiveCamera, useScroll} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";

const NUM_OF_POINTS = 12000;
const CURVE_AHEAD_CAMERA = 0.008;

const CameraControlCurve = () => {
  const targetPostionVec3 = targetPosition.map(i => new THREE.Vector3(...i));
  const curve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      targetPostionVec3,
      false,
      "catmullrom",
      0.5
    );
    return curve;
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(NUM_OF_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);
    return shape;
  }, [curve]);

  const scroll = useScroll();

  useFrame(({camera}, delta) => {
    const scrollOffseet = Math.max(0, scroll.offset);
    const curPoint = curve.getPoint(scrollOffseet);
    camera.position.lerp(curPoint, delta * 24);

    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffseet + CURVE_AHEAD_CAMERA, 1)
    );
    //Get current look at direction of the camera
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    const targetLookAt = new THREE.Vector3()
      .subVectors(lookAtPoint, curPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, 0.8);
    camera.lookAt(camera.position.clone().add(lookAt));
  });

  return (
    <>
      <PerspectiveCamera position={[0.18, 8.5, 15.6]} makeDefault />
      {/* <Line points={linePoints} color="white" opacity={0.7} linewidth={16} />
      <mesh>
        <extrudeGeometry
          args={[
            shape,
            {
              steps: NUM_OF_POINTS,
              bevelEnabled: false,
              extrudePath: curve,
            },
          ]}
        />
        <meshStandardMaterial color={"white"} transparent opacity={0.7} />
      </mesh> */}
    </>
  );
};

export default CameraControlCurve;
