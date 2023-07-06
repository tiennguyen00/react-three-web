"use client";
import Portals from "@/components/Portals";
import {OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

export default function PortalScene() {
  return (
    <div className="relative w-screen h-screen">
      <Canvas
        shadows
        camera={{
          position: [0, 0, 10],
          fov: 30,
        }}
      >
        <OrbitControls />
        {/* <Environment background files={"/images/mysterious_forest.hdr"} /> */}
        <ambientLight intensity={0.5} />
        <Portals />
      </Canvas>
    </div>
  );
}
