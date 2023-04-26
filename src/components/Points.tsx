import vertex from "raw-loader!../glsl/practicles/vertex.glsl";
import fragment from "raw-loader!../glsl/practicles/fragment.glsl";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useControls } from "leva";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { gsap, Power3 } from "gsap";

const Points = () => {
  const texture = useLoader(THREE.TextureLoader, "/images/1.jpeg");
  const shaderRef = useRef(null);

  const { diffusion, intensity } = useControls({
    diffusion: {
      value: 0,
      min: 0,
      step: 0.05,
    },
    intensity: {
      value: 0.5,
      step: 0.1,
      min: 0.1,
    },
    luminanceThreshold: {
      value: 0.9,
      step: 0.1,
    },
  });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (shaderRef.current) {
      (shaderRef.current as any).uniforms.uTime.value = time;
    }
  });

  const uniforms: any = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uDiffusion: { value: diffusion },
    }),
    []
  );
  useEffect(() => {
    // console.log(uniforms.uDiffusion.value);
    // const timeline = gsap.timeline({ repeat: -1, yoyo: true });
    // timeline.to(uniforms.uDiffusion.value, {
    //   value: 5.5,
    //   duration: 5,
    //   // delay: 3.962292,
    //   ease: Power3.easeIn,
    //   onUpdate: () => {
    //     uniforms.uDiffusion.value += 0.1;
    //     console.log(uniforms.uDiffusion.value);
    //   },
    // });
    setTimeout(() => {
      setInterval(() => {
        uniforms.uDiffusion.value += 0.002;
      }, 0.002 * 1000);
    }, 3.962292 * 1000);
  }, []);

  return (
    <>
      <points>
        <planeGeometry args={[480, 820, 480, 820]} />
        <shaderMaterial
          attach="material"
          ref={shaderRef}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniformsNeedUpdate={true}
        />
      </points>

      <EffectComposer>
        <Bloom
          luminanceSmoothing={0.1}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.1}
          intensity={intensity}
        />
      </EffectComposer>
    </>
  );
};

export default Points;
