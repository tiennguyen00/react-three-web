"use client";

import House from "@/components/HauntedHouse";
import Switches from "@/components/Switches";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex w-screen h-screen ">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
          position: [0, 3.5, 3],
        }}
      >
        {/* <color attach="background" args={["red"]} /> */}
        <ambientLight color={"white"} intensity={0.8} />
        <axesHelper args={[2]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Switches />
          <House scale={0.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
