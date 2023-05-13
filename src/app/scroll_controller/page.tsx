"use client";

import Ground from "@/components/Ground";
import House from "@/components/House";
import Pumpkin from "@/components/Pumpkin";
import Switches from "@/components/Switches";
import {
  AccumulativeShadows,
  Center,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { Suspense } from "react";
import * as THREE from "three";

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
        <ambientLight />
        <hemisphereLight color="blue" groundColor="red" intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight
          position={[0, -1.35, 0]}
          color="orange"
          intensity={25}
          distance={2}
        />

        <AccumulativeShadows
          position={[0, -2.24, 0]}
          temporal
          frames={100}
          alphaTest={0.9}
          opacity={1.5}
          scale={12}
        >
          <RandomizedLight
            amount={8}
            radius={2}
            ambient={0.5}
            intensity={1}
            position={[-2.5, 5, 0.5]}
            bias={0.001}
          />
        </AccumulativeShadows>

        {/* <EffectComposer disableNormalPass>
          <Bloom mipmapBlur luminanceThreshold={1} />
          <ToneMapping
            adaptive
            resolution={256}
            middleGrey={0.4}
            maxLuminance={16.0}
            averageLuminance={1.0}
            adaptationRate={1.0}
          />
        </EffectComposer> */}

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
