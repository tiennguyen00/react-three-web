import { ISheetObject, types, onChange } from "@theatre/core";
import { PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CameraControlTheatre = () => {
  const threeRef = useRef<any>();
  const [theatreObject, setTheatreObject] = useState<ISheetObject>();

  const isScrolling = useRef(false);

  const directionScroll = useRef(0);
  const index = useRef<0 | 1 | 2 | 3 | 4 | 5>(0);
  const currentSheet = useCurrentSheet();

  const stops = [0, 2, 5, 8, 10, 16];

  const handleWheeling = (e: any) => {
    if (!currentSheet || !currentSheet.project.isReady) return;
    if (isScrolling.current) return;

    const direction = Math.sign(e.wheelDelta);
    const mappedStops = direction ? stops.reverse() : stops;

    const nextStop = mappedStops.find((stop) =>
      direction > 0
        ? stop < currentSheet.sequence.position
        : stop > currentSheet.sequence.position
    );

    if (!nextStop)
      currentSheet.sequence.play({
        range: [0, 2],
      });
    else {
      currentSheet.sequence.play({
        range: [currentSheet.sequence.position, nextStop],
        direction: direction > 0 ? "reverse" : "normal",
      });
    }
  };

  useEffect(() => {
    if (!currentSheet) return;
    onChange(currentSheet?.sequence.pointer.playing, (playing) => {
      isScrolling.current = playing;
    });
  }, [currentSheet]);

  useEffect(() => {
    // if `theatreObject` is `null`, we don't need to do anything
    if (!theatreObject) return;

    const unsubscribe = theatreObject.onValuesChange((newValues) => {
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
    window.addEventListener("wheel", handleWheeling);
    return () => {
      window.removeEventListener("wheel", handleWheeling);
    };
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
