"use client";

import dynamic from "next/dynamic";
import type { SceneVariant } from "./construction-model";

const ConstructionScene = dynamic(() => import("./ConstructionScene"), { ssr: false });

export default function SceneViewport({ variant }: { variant: SceneVariant }) {
  return (
    <div className="scene-experience" role="group" aria-label="Interactive 3D construction scene">
      <div className="scene-viewport" data-running="false">
        <div className="scene-orbit scene-orbit-outer" aria-hidden="true" />
        <div className="scene-orbit scene-orbit-inner" aria-hidden="true" />
        <div className="scene-cross scene-cross-top" aria-hidden="true" />
        <div className="scene-cross scene-cross-bottom" aria-hidden="true" />
        <ConstructionScene variant={variant} />
      </div>
      <p className="scene-instructions">Drag to rotate · Click a model to animate</p>
    </div>
  );
}
