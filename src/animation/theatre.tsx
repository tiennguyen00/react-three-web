"use client";

import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import {getProject} from "@theatre/core";

export function initTheatreStudio() {
  studio.initialize();
  studio.extend(extension);
  // studio.ui.hide();
}

export const cameraMovementSheet = getProject("CameraMove_Project", {}).sheet(
  "CameraMovement"
);
