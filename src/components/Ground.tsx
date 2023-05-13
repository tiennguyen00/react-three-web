import { useTexture } from "@react-three/drei";

const Ground = () => {
  const texture = useTexture("/textures/dirt_ground.png");
  console.log(texture);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Ground;
