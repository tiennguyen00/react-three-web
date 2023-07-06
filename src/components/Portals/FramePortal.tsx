import {
  useCursor,
  Text,
  MeshPortalMaterial,
  RoundedBox,
} from "@react-three/drei";
import {PropsWithChildren, useMemo, useRef, useState} from "react";
import {GroupProps, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {easing} from "maath";

interface FrameProps {
  id: string;
  name: string;
  props?: GroupProps;
  map: THREE.Texture;
  active: string | undefined;
  setActive: (v: string) => void;
}

const FramePortal = ({
  id,
  name,
  children,
  props,
  map,
  active,
  setActive,
}: PropsWithChildren<FrameProps>) => {
  const portal = useRef();
  const [hovered, setHover] = useState(false);

  useCursor(hovered);
  useFrame((_, delta) => {
    const isOpen = active === id;
    easing.damp(portal.current, "blend", isOpen ? 1 : 0, 0.08, delta);
  });

  return (
    <group {...props}>
      <Text fontSize={0.5} position={[0, -1.3, 0.26]} anchorY={"bottom"}>
        {name}
        <meshBasicMaterial color={"#FFF"} toneMapped={false} />
      </Text>
      <RoundedBox
        name={id}
        args={[2, 3, 0.1]}
        radius={0.15}
        onDoubleClick={() => setActive(id)}
        onPointerOver={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
      >
        <MeshPortalMaterial ref={portal} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};

export default FramePortal;
