import {types} from "@theatre/core";
import {PerspectiveCamera} from "@theatre/r3f";
import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {cameraMovementSheet} from "../../animation/theatre";

const CameraControlTheatre = () => {
  const threeRef = useRef<any>();
  const [theatreObject, setTheatreObject] = useState<any>(null);

  useEffect(() => {
    // if `theatreObject` is `null`, we don't need to do anything
    if (!theatreObject) return;

    const unsubscribe = theatreObject.onValuesChange(newValues => {
      if (threeRef.current) {
        threeRef.current.lookAt(
          new THREE.Vector3(
            newValues.lookAt.x,
            newValues.lookAt.y,
            newValues.lookAt.z
          )
        );
      }
    });
    return unsubscribe;
  }, [theatreObject]);

  useEffect(() => {
    cameraMovementSheet.project.ready.then(() =>
      cameraMovementSheet.sequence.play({
        iterationCount: Infinity,
        // range: [0, 1],
      })
    );
  }, []);

  return (
    <PerspectiveCamera
      theatreKey="Camera"
      makeDefault
      fov={75}
      near={0.1}
      far={100}
      ref={threeRef}
      objRef={setTheatreObject}
      additionalProps={{
        lookAt: types.compound({
          x: types.number(0),
          y: types.number(0),
          z: types.number(0),
        }),
      }}
    />
  );
};

export default CameraControlTheatre;
