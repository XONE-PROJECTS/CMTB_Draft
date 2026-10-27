"use client";

import { useEffect, useRef } from "react";
import { createSceneRuntime, type SceneController, type SceneStatus } from "./construction-runtime";
import type { SceneVariant } from "./construction-model";

type Props = {
  variant: SceneVariant;
  onReady?: (controller: SceneController | null) => void;
  onStatus?: (status: SceneStatus) => void;
};

export default function ConstructionScene({ variant, onReady, onStatus }: Props) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    const controller = createSceneRuntime(host, variant, onStatus ?? (() => {}));
    onReady?.(controller);
    return () => { onReady?.(null); controller.dispose(); };
  }, [variant, onReady, onStatus]);

  return <div ref={container} className="construction-canvas" data-scene={variant} tabIndex={0} role="group" aria-label="3D construction model. Drag or use arrow keys to rotate. Press Space to pause, or Enter to animate." />;
}
