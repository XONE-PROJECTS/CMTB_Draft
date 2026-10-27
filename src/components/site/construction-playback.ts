export const buildingStages = ["assembled", "wireframe", "exploded", "reassembled"] as const;
export type BuildingStage = typeof buildingStages[number];
export type BuildingPose = { wireframe: number; explosion: number };

export const stageTimes: Record<BuildingStage, number> = { assembled: 0, wireframe: 4, exploded: 9, reassembled: 14 };
export const stagePoses: Record<BuildingStage, BuildingPose> = {
  assembled: { wireframe: 0, explosion: 0 },
  wireframe: { wireframe: 1, explosion: 0 },
  exploded: { wireframe: 1, explosion: 1 },
  reassembled: { wireframe: 0, explosion: 0 },
};

export function smoothProgress(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export function buildingPlayback(time: number): BuildingPose & { stage: BuildingStage } {
  const t = ((time % 16) + 16) % 16;
  if (t < 2) return { ...stagePoses.assembled, stage: "assembled" };
  if (t < 6) return { wireframe: smoothProgress((t - 2) / 2), explosion: 0, stage: "wireframe" };
  if (t < 11) return { wireframe: 1, explosion: smoothProgress((t - 6) / 3), stage: "exploded" };
  const remaining = 1 - smoothProgress((t - 11) / 3);
  return { wireframe: remaining, explosion: remaining, stage: "reassembled" };
}

export function isSceneDrag(startX: number, startY: number, x: number, y: number) {
  return Math.hypot(x - startX, y - startY) > 6;
}
