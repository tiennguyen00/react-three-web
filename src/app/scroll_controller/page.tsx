"use client";

import Effect from "@/components/Effect";
import Ground from "@/components/Ground";
import House from "@/components/House";
import Light from "@/components/Light";
import Pumpkin from "@/components/Pumpkin";
import Switches from "@/components/Switches";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Suspense } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";

/** The bloom pass is what will create glow, always set the threshold to 1, nothing will glow
         /*  except materials without tonemapping whose colors leave RGB 0-1 */

export default function Home() {
  return (
    <div className="flex w-screen h-screen ">
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
          position: [0, 2, 8],
        }}
      >
        <Perf position="top-left" />

        <Light />
        <Effect />

        <axesHelper args={[2]} position={[0, 5, 0]} />
        <OrbitControls />

        <Ground />
        <Pumpkin />

        <Suspense fallback={null}>
          <Switches
            props={{
              position: new THREE.Vector3(0, 0, 8),
              scale: 0.5,
            }}
          />
          <House
            props={{
              scale: 8,
              rotation: [0, Math.PI * 0.5, 0],
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
