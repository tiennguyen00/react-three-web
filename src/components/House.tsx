import React from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

function House({ props }: { props?: GroupProps }) {
  const { nodes, materials, scene }: any = useGLTF("/models/fantasy_town.glb");
  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/house.glb");

export default House;
