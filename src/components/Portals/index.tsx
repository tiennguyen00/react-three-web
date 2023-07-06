import {CameraControls, useTexture, Text} from "@react-three/drei";
import FramePortal from "./FramePortal";
import {useEffect, useRef, useState} from "react";
import {useThree} from "@react-three/fiber";
import * as THREE from "three";

const Portals = () => {
  const [active, setActive] = useState<string | undefined>();
  const map = useTexture("/images/mysterious_forest.jpg");
  const controlsRef = useRef<CameraControls>(null);
  const scene = useThree(s => s.scene);

  useEffect(() => {
    if (!controlsRef.current) return;
    if (active) {
      const targetPos = new THREE.Vector3();
      scene.getObjectByName(active)?.getWorldPosition(targetPos);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPos.x,
        targetPos.y,
        targetPos.z,
        true
      );
    }
  }, [active]);

  return (
    <>
      <Text fontSize={0.5} position={[0, 0, 0]} anchorY={"top"}>
        Back
        <meshBasicMaterial color={"red"} toneMapped={false} />
      </Text>
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <FramePortal
        active={active}
        setActive={setActive}
        id="1"
        name="1"
        map={map}
      ></FramePortal>
    </>
  );
};

export default Portals;
