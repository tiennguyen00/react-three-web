"use client";

import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import {getProject} from "@theatre/core";
import animationState from "./Jun29_TheatreState.json";

export function initTheatreStudio() {
  studio.initialize();
  studio.extend(extension);
  // studio.ui.hide();
}

export const cameraMovementSheet = getProject("CameraMove_Project", {
  state: animationState,
}).sheet("CameraMovement");
