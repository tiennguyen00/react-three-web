"use client";

import Effect from "@/components/Effect";
import Ground from "@/components/Ground";
import Light from "@/components/Light";
import { OrbitControls, ScrollControls } from "@react-three/drei";

import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import Container from "@/components/Container";
import { MotionCanvas } from "framer-motion-3d";
import { MotionConfig, motion } from "framer-motion";
import Background from "@/components/Background";

/** The bloom pass is what will create glow, always set the threshold to 1, nothing will glow
         /*  except materials without tonemapping whose colors leave RGB 0-1 */

export default function Home() {
  const refSwitch = useRef<THREE.Group>(null);
  const refCastle = useRef<THREE.Group>(null);

  const [onGreetAniComplete, setOnGreetAniComplete] = useState(false);

  return (
    <div
      className="relative flex w-screen h-screen"
      onScroll={() => {
        console.log("sc");
      }}
    >
      <MotionConfig
        transition={{
          delay: 0.2,
          duration: 2,
          ease: "easeOut",
        }}
      >
        <motion.div className="absolute z-10 -translate-x-1/2 bottom-[80px] left-1/2">
          <motion.h1
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={!onGreetAniComplete ? "" : { opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              type: "spring",
              damping: 10,
              stiffness: 500,
            }}
            className="text-7xl font-luckiestguy text-stroke"
          >
            Welcome
          </motion.h1>
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={!onGreetAniComplete ? "" : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
            }}
            className="px-4 py-2 text-black bg-white rounded-md max-w-[950px] w-full -translate-y-4"
          >
            <p className="font-poppins ">
              Welcome to my playground! I created this site to experiment,
              showcase, and host some of my favorite projects. If you&apos;re
              reading this now, I&apos;ve given you a special sneak peek. I have
              a lot more to add as I continue exploring and developing 3D
              websites!
            </p>
          </motion.div>
        </motion.div>

        <MotionCanvas
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

          {/* <axesHelper args={[2]} position={[0, 5, 0]} /> */}
          {/* <OrbitControls /> */}

          <Ground />
          <Background />

          <Suspense fallback={null}>
            <ScrollControls pages={4}>
              <Container
                refSwitch={refSwitch}
                refCastle={refCastle}
                setOnGreetAniComplete={setOnGreetAniComplete}
              />
            </ScrollControls>
          </Suspense>
        </MotionCanvas>
      </MotionConfig>
    </div>
  );
}
