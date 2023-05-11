import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Points from "./Points";

const Practices = ({ isEndedVideo }: { isEndedVideo: boolean }) => {
  return (
    <Canvas
      camera={{
        fov: 75,
        near: 1,
        far: 5000,
        position: [0, 0, 1200],
      }}
      gl={{}}
    >
      <axesHelper />
      <color attach="background" args={["black"]} />

      <ScrollControls pages={3} distance={1}>
        <Points isEndedVideo={isEndedVideo} />
      </ScrollControls>
    </Canvas>
  );
};

export default Practices;
