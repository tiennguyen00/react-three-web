"use client";
import Practices from "@/components/Praticles";
import { useSpring, animated } from "@react-spring/web";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEndedVideo, setIsEndedVideo] = useState(false);
  const props = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    delay: (3.962292 - 0.2) * 1000,
    duration: 200,
  });

  return (
    <div className="relative w-screen h-screen">
      <animated.div
        style={props}
        className="absolute z-10 flex justify-center -translate-x-1/2 -translate-y-1/2 border-red-200 opacity-50 top-1/2 left-1/2"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          className="lg:w-[120px] xl:w-[213px] 2xl:w-[359px]"
          onEnded={() => {
            setIsEndedVideo(true);
          }}
        >
          <source src="/videos/1.mp4" type="video/mp4" />
        </video>
      </animated.div>
      <Practices isEndedVideo={isEndedVideo} />
    </div>
  );
}
