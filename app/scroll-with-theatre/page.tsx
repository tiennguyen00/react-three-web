"use client";

import { ScrollControls} from "@react-three/drei";
import {Suspense} from "react";
import {editable as e, SheetProvider} from "@theatre/r3f";
import {cameraMovementSheet, initTheatreStudio} from "@/animation/theatre";
import CameraControlTheatre from "@/utils/CameraControlTheatre";
import House from "@/components/scroll-with-theatre/House"
import dynamic from "next/dynamic";
import {LoadingIcon} from '@/components/shared';
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <LoadingIcon/>,
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

initTheatreStudio();
export default function Page() {
  return (

    <div className='mx-auto flex w-full flex-col flex-wrap items-center md:flex-row lg:w-4/5'>
        <div className='w-full text-center md:w-3/5'>
          <View orbit className='flex h-96 w-full flex-col items-center justify-center'>
            <SheetProvider sheet={cameraMovementSheet}>
              <CameraControlTheatre />
                <ScrollControls pages={4}>
                  <Suspense fallback={null}>
                    <House
                      props={{
                        scale: 8,
                        rotation: [0, Math.PI * 0.5, 0],
                      }}
                    />
                    <Common />
                  </Suspense>
                </ScrollControls>
          </SheetProvider>
          </View>
        </div>
      </div>
  );
}

