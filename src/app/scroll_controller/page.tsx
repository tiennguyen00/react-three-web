"use client";

import Effect from "@/components/Effect";
import Ground from "@/components/Ground";
import Light from "@/components/Light";
import Pumpkin from "@/components/Pumpkin";
import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import Container from "@/components/Container";

/** The bloom pass is what will create glow, always set the threshold to 1, nothing will glow
         /*  except materials without tonemapping whose colors leave RGB 0-1 */

export default function Home() {
  const refSwitch = useRef<THREE.Group>(null);
  const refCastle = useRef<THREE.Group>(null);

  return (
    <div className="relative flex w-screen h-screen ">
      <div className="absolute z-10 -translate-x-1/2 bottom-[200px] left-1/2">
        <h1 className="text-7xl font-luckiestguy text-stroke">Welcome</h1>
        <div className="px-4 py-2 text-black bg-white rounded-md max-w-[950px] w-full -translate-y-4">
          <p className="font-poppins ">
            Welcome to my playground! I created this site to experiment,
            showcase, and host some of my favorite projects. If you&apos;re
            reading this now, I&apos;ve given you a special sneak peek. I have a
            lot more to add as I continue exploring and developing 3D websites!
          </p>
        </div>
      </div>
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
          position: [0.18, 8.5, 15.6],
        }}
      >
        <Perf position="top-left" />

        <Light />
        <Effect />

        <axesHelper args={[2]} position={[0, 5, 0]} />
        {/* <OrbitControls /> */}

        <Ground />
        {/* <Pumpkin /> */}

        <Suspense fallback={null}>
          <ScrollControls pages={4}>
            <Container refSwitch={refSwitch} refCastle={refCastle} />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
