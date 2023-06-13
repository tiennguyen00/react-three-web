import {Environment, Sphere} from "@react-three/drei";
import {Gradient, LayerMaterial} from "lamina";
import * as THREE from "three";

const Background = () => {
  return (
    <Environment resolution={256} background>
      <Sphere scale={[50, 50, 50]} rotation-y={Math.PI / 2}>
        <LayerMaterial color={"#FFF"} side={THREE.BackSide}>
          <Gradient
            colorA={"#357CA1"}
            colorB={"white"}
            axes="y"
            start={0}
            end={-0.5}
          />
        </LayerMaterial>
      </Sphere>
    </Environment>
  );
};

export default Background;
