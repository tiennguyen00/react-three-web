import { Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

const Background = () => {
  return (
    <Sphere args={[1000, 1000, 1000]}>
      <LayerMaterial lighting="physical" transmission={1} side={THREE.BackSide}>
        <Gradient
          colorA={"#357CA1"}
          colorB={"white"}
          axes="y"
          start={0}
          end={-0.5}
        />
      </LayerMaterial>
    </Sphere>
  );
};

export default Background;
