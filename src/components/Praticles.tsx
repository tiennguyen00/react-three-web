import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Points from "./Points";

const Practices = () => {
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
      <OrbitControls />
      <color attach="background" args={["black"]} />

      <Points />
    </Canvas>
  );
};

export default Practices;
