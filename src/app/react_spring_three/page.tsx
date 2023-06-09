"use client";
import Practices from "@/components/Praticles";
// import { useSpring, animated } from "@react-spring/web";
import {useRef, useState} from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEndedVideo, setIsEndedVideo] = useState(false);

  return (
    <div className="relative w-screen h-screen">
      <div
        // style={props}
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
          <source src="/videos/1.mp4" type="vidßeo/mp4" />
        </video>
      </div>
      <Practices isEndedVideo={isEndedVideo} />
    </div>
  );
}
