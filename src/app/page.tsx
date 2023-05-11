"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen ">
      <Link href="/react_spring_three">react-spring/three</Link>
      <Link href="/scroll_controller">scroll controller</Link>
    </div>
  );
}
