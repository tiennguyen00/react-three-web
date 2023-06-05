import { LayoutCamera } from "framer-motion-3d";
import { useEffect, useRef, useState } from "react";

interface CameraControlProps {
  setOnGreetAniComplete: (v: boolean) => void;
}

const initedPosition = [0.18, 0.5, 10.8];

const targetPosition = [
  initedPosition,
  [-6, 1.5, 8],
  [10, 3.5, 8.5],
  [2.5, 2, 4],
  [2.5, 5.5, 5.5],
  [-9.5, 3, -3],
];

const targetLookAt = [
  [0, 0, 0],
  [-4, 0.5, 5.5],
  [8, 2.5, 6.5],
  [2.5, 2, 1],
  [2.5, 5, 2.5],
  [-6, 2, -3],
];

const CameraControl = ({ setOnGreetAniComplete }: CameraControlProps) => {
  const [positionCam, setPositionCam] = useState(initedPosition);
  const [isScrolling, setIsScrolling] = useState(false);

  const directionScroll = useRef(0);
  const prevPositionCam = useRef([0.18, 8.5, 15.6]);
  const isAnimating = useRef(false);
  const index = useRef<0 | 1 | 2 | 3 | 4 | 5>(0);

  const handleWheeling = (e: any) => {
    directionScroll.current = Math.sign(e.wheelDelta);
    let wheelingId: any;
    if (!wheelingId) setIsScrolling(true);
    clearTimeout(wheelingId);
    wheelingId = setTimeout(function () {
      setIsScrolling(false);
      wheelingId = undefined;
    }, 250);
  };

  useEffect(() => {
    document.addEventListener("wheel", handleWheeling);

    return () => {
      document.removeEventListener("wheel", handleWheeling);
    };
  }, []);

  useEffect(() => {
    if (!isScrolling || isAnimating.current) return;
    if (
      (index.current === 5 && directionScroll.current < 0) ||
      (index.current === 0 && directionScroll.current > 0)
    )
      return;

    index.current -= Math.sign(directionScroll.current);
    setPositionCam(targetPosition[index.current]);
  }, [isScrolling]);

  useEffect(() => {
    prevPositionCam.current = positionCam;
  }, [positionCam]);

  return (
    <LayoutCamera
      key={positionCam[0] + positionCam[1] + positionCam[2]}
      initial={{
        x: prevPositionCam.current[0],
        y: prevPositionCam.current[1],
        z: prevPositionCam.current[2],
      }}
      animate={{
        x: positionCam[0],
        y: positionCam[1],
        z: positionCam[2],
      }}
      onAnimationComplete={() => {
        setOnGreetAniComplete(true);
        isAnimating.current = false;
      }}
      onAnimationStart={() => {
        isAnimating.current = true;
      }}
    />
  );
};

export default CameraControl;
