/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Eh (https://sketchfab.com/Just_Eh)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/fantasy-town-0db322fa7a614975b83753a37c4e7350
title: Fantasy Town
*/

import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Home({ props }: { props: GroupProps }) {
  const { nodes, materials }: any = useGLTF("/models/fantasy_town.glb");
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(new THREE.Vector3(-2, 5, 0));
  }, []);

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.08}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-4.06, 4.05, 4.1]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_5.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={materials.stairs}
            />
          </group>
          <group
            position={[-4.4, -2.01, -5.4]}
            rotation={[-0.91, -0.51, -0.63]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_7.geometry}
              material={materials.bricks}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_8.geometry}
              material={materials.outline}
            />
          </group>
          <group position={[2.48, 10.32, 0.1]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_10.geometry}
              material={materials.GLASS}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_11.geometry}
              material={materials["deco.001"]}
            />
          </group>
          <group
            position={[6.54, 4.63, -7.53]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_13.geometry}
              material={materials.Papers_noname}
            />
          </group>
          <group position={[1.79, 9.73, -2.12]} rotation={[0, Math.PI / 2, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_15.geometry}
              material={materials.deco}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_16.geometry}
              material={materials.outline}
            />
          </group>
          <group position={[-3.38, 12.19, 0.25]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_18.geometry}
              material={materials.material}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_19.geometry}
              material={materials.floor}
            />
          </group>
          <group position={[3.67, 20.29, -1.62]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_21.geometry}
              material={materials.bricks}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_22.geometry}
              material={materials["outline.001"]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_23.geometry}
              material={materials.outline}
            />
          </group>
          <group position={[2.61, 18.24, -1.94]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_26.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_25.geometry}
              material={materials.Pipe}
            />
          </group>
          <group position={[2.38, 4.21, -6.35]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_28.geometry}
              material={materials.fence}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_29.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_30.geometry}
              material={materials.emis}
            />
          </group>
          <group position={[-8.03, -0.28, 11.06]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_33.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_32.geometry}
              material={materials.WALL_1}
            />
          </group>
          <group position={[-2.66, 1.65, 9.36]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_36.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_35.geometry}
              material={materials.FLOOR_2}
            />
          </group>
          <group position={[5.41, 11.04, 10.97]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_39.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_38.geometry}
              material={materials.house_1}
            />
          </group>
          <group position={[6.38, 8.41, 0.56]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_42.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_41.geometry}
              material={materials.house_5}
            />
          </group>
          <group position={[6.44, 14.1, -5.34]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_45.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_44.geometry}
              material={materials.House_4}
            />
          </group>
          <group position={[-3.54, 6.94, -9.73]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_48.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_47.geometry}
              material={materials.house_3}
            />
          </group>
          <group position={[-4.84, 4.86, -1.24]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_51.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_50.geometry}
              material={materials.house_2}
            />
          </group>
          <group position={[-0.32, 5.33, 0.99]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_54.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_53.geometry}
              material={materials["base.001"]}
            />
          </group>
          <group position={[-7, 5.62, 9.98]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_57.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_56.geometry}
              material={materials["floor.001"]}
            />
          </group>
          <group
            position={[3.11, 0.01, 12.95]}
            rotation={[-0.91, -0.51, -0.63]}
            scale={2.17}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_60.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_59.geometry}
              material={materials["bricks.001"]}
            />
          </group>
          <group
            position={[-3.59, -1.12, -1.04]}
            rotation={[-0.91, -0.51, -0.63]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_63.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_62.geometry}
              material={materials["bricks.001"]}
            />
          </group>
          <group position={[5.49, 0.81, -12.23]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_66.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_65.geometry}
              material={materials.bricks_02}
            />
          </group>
          <group position={[1.06, 0.73, -4.41]} scale={1.78}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_69.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_68.geometry}
              material={materials["floor.002"]}
            />
          </group>
          <group position={[9.96, 9.9, 10.67]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_71.geometry}
              material={materials.house_1}
            />
          </group>
          <group position={[6.45, 13.86, -5.41]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_73.geometry}
              material={materials.House_4}
            />
          </group>
          <group position={[6.46, 9.42, 1.88]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_75.geometry}
              material={materials.house_5}
            />
          </group>
          <group position={[3.15, 13.79, 11.91]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_77.geometry}
              material={materials.house_1}
            />
          </group>
          <group position={[-3.87, 7.08, -1.59]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_79.geometry}
              material={materials.house_2}
            />
          </group>
          <group position={[-2.28, 9.1, -9.68]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_81.geometry}
              material={materials.house_3}
            />
          </group>
          <group position={[1.69, 5.01, -2.84]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_83.geometry}
              material={materials.GLASS}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_84.geometry}
              material={materials["deco.001"]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_85.geometry}
              material={materials.fence}
            />
          </group>
          <group position={[2.62, 13.59, -3.2]} rotation={[0, Math.PI / 2, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_87.geometry}
              material={materials.bricks}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_88.geometry}
              material={materials.outline}
            />
          </group>
          <group position={[2.2, 16.91, -2.96]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_90.geometry}
              material={materials.outline}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_92.geometry}
              material={materials.deco}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_93.geometry}
              material={materials["outline.001"]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_91.geometry}
              material={materials.roof}
            />
          </group>
          <group position={[8.97, 4.45, 10.7]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_95.geometry}
              material={materials.bricks}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_96.geometry}
              material={materials.floor}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_97.geometry}
              material={materials.outline}
            />
          </group>
          <group
            position={[6.29, 7, 15.01]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_99.geometry}
              material={materials.papers_eye}
            />
          </group>
          <group
            position={[0.41, 5.86, 6.24]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_101.geometry}
              material={materials.papers_bridge}
            />
          </group>
          <group
            position={[2.81, 8.93, 9.4]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_103.geometry}
              material={materials.papers_ton}
            />
          </group>
          <group
            position={[-3.15, 5.23, 12.38]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_105.geometry}
              material={materials.Papers_cat}
            />
          </group>
          <group
            position={[4.77, 5.39, 15]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_107.geometry}
              material={materials.Papers_who}
            />
          </group>
          <group
            position={[4.01, 9.94, -5.23]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[1.75, 1, 2.84]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_109.geometry}
              material={materials.Papers_banner}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

export default Home;

useGLTF.preload("/models/fantasy_town.glb");
