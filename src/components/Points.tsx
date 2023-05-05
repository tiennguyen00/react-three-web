import vertex from "raw-loader!../glsl/practicles/vertex.glsl";
import fragment from "raw-loader!../glsl/practicles/fragment.glsl";
import * as THREE from "three";
import { type ThreeElement, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { shaderMaterial } from "@react-three/drei";
import { animated, easings, useSpring } from "@react-spring/three";

const loader = new THREE.TextureLoader();

const ColorShiftMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: loader.load("/images/1.jpeg"),
    uDiffusion: 0,
  },
  vertex,
  fragment
);

extend({ ColorShiftMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    colorShiftMaterial: ThreeElement<typeof ColorShiftMaterial>;
  }
}

const Points = ({ isEndedVideo }: { isEndedVideo: boolean }) => {
  const shaderRef = useRef(null);

  const [props, api] = useSpring(
    {
      from: {
        diffution: 0,
      },
      to: {
        diffution: 5,
      },
      config: {
        duration: 8000,
        easing: easings.easeInOutExpo,
      },
      delay: 3000,
    },
    []
  );

  useEffect(() => {
    if (isEndedVideo) api.start();
  }, [isEndedVideo]);

  const FinalMaterial: any = animated(({ ...props }) => {
    return (
      <>
        <colorShiftMaterial
          attach="material"
          ref={shaderRef}
          uDiffusion={props.uDiffusion}
        />
      </>
    );
  });

  return (
    <>
      <points>
        <planeGeometry args={[480, 820, 480, 820]} />
        <FinalMaterial uDiffusion={props.diffution} />
      </points>

      <EffectComposer>
        <Bloom
          luminanceSmoothing={0.1}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.1}
          intensity={0.5}
        />
      </EffectComposer>
    </>
  );
};

export default Points;
