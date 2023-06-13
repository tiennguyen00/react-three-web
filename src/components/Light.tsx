import {useHelper} from "@react-three/drei";
import {useRef} from "react";
import {SpotLight, SpotLightHelper} from "three";
import {folder, useControls} from "leva";

const Light = () => {
  const refSpotLight = useRef<SpotLight>(null!);

  useHelper(false ?? refSpotLight, SpotLightHelper, "#9b59b6");
  const {enable, positionSpot} = useControls({
    enable: false,
    spotLight: folder({
      positionSpot: {
        value: [10, 20, 6],
        step: 2,
      },
    }),
  });

  return (
    <>
      {enable && (
        <>
          <ambientLight intensity={0.2} />
          <hemisphereLight
            color="#5c3c6e"
            groundColor="#1c1c1c"
            intensity={0.6}
          />
          <spotLight
            ref={refSpotLight}
            position={positionSpot}
            angle={Math.PI * 0.15}
            penumbra={0.8}
            distance={50}
            color="#9b59b6"
            intensity={1.2}
          />
        </>
      )}
      {/* <pointLight
        position={[2, 2, 2]}
        color="yellow"
        intensity={25}
        distance={2}
      /> */}

      {/* <AccumulativeShadows
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
        </AccumulativeShadows> */}
    </>
  );
};

export default Light;
