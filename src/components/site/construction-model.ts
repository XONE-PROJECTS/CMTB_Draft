import * as THREE from "three";
import { createSceneParts } from "./construction-parts";
import { createFleet } from "./construction-fleet";
import { createWorkers } from "./construction-workers";
import { createTechnicalDrawing } from "./construction-drawings";
import type { BuildingPose } from "./construction-playback";

export type SceneVariant = "home" | "about" | "services" | "equipment" | "projects" | "detail" | "compliance" | "contact";
export type SceneAction = { id: string; label: string };

export function createConstructionModel(variant: SceneVariant) {
  const root = new THREE.Group();
  const parts = createSceneParts(root);
  const { box, beam, edges, geometries, resources: materials } = parts;
  const { concrete, steel, red, dark, glass } = parts.materials;
  const movingFloors: { group: THREE.Object3D; height: number; index: number }[] = [];
  const buildingMaterials = new Map<THREE.Material, THREE.Material>();
  const wireMaterial = new THREE.LineBasicMaterial({ color: 0xd6edef, transparent: true, opacity: 0 });
  materials.add(wireMaterial);
  const wireEdges: THREE.LineSegments[] = [];
  const actions: SceneAction[] = [];
  const interactiveTargets: THREE.Object3D[] = [];
  const actionStarts = new Map<string, number>();
  let currentTime = 0;
  let jib: THREE.Group | undefined;
  let sweep: THREE.Mesh | undefined;
  let hoistCable: THREE.Mesh | undefined;
  let hoistLoad: THREE.Group | undefined;
  let carrier: THREE.Group | undefined;
  let drawing: ReturnType<typeof createTechnicalDrawing> | undefined;
  let updateFleet: ((time: number) => void) | undefined;
  let disposed = false;

  function register(object: THREE.Object3D, id: string, label: string) {
    object.userData.actionId = id;
    interactiveTargets.push(object);
    if (!actions.some(action => action.id === id)) actions.push({ id, label });
  }

  function actionProgress(id: string, time: number) {
    const start = actionStarts.get(id);
    if (start !== undefined && time - start <= 3) return THREE.MathUtils.clamp((time - start) / 3, 0, 1);
    return THREE.MathUtils.clamp(((time % 10) - 5) / 3, 0, 1);
  }

  function building(x: number, z: number, floors: number, width = 3, depth = 2.5, glazed = false) {
    const structure = new THREE.Group();
    structure.name = "building";
    structure.position.set(x, 0.25, z);
    root.add(structure);
    register(structure, "building", "Replay building sequence");
    for (let floor = 0; floor < floors; floor++) {
      const level = new THREE.Group();
      const height = floor * 0.9;
      level.position.y = height;
      level.name = `building-floor-${floor}`;
      structure.add(level);
      box(level, concrete, [width, 0.14, depth], [0, 0, 0]);
      for (const columnX of [-width / 2 + 0.16, width / 2 - 0.16]) {
        for (const columnZ of [-depth / 2 + 0.16, depth / 2 - 0.16]) {
          box(level, steel, [0.15, 0.85, 0.15], [columnX, 0.48, columnZ]);
        }
      }
      if (glazed) {
        box(level, glass, [width - 0.3, 0.66, depth - 0.3], [0, 0.46, 0]);
      } else {
        box(level, red, [width, 0.055, 0.055], [0, 0.65, depth / 2]);
        box(level, concrete, [0.5, 0.85, 0.6], [0, 0.48, 0]);
      }
      movingFloors.push({ group: level, height, index: floor });
    }
    const roof = box(structure, concrete, [width + 0.16, 0.18, depth + 0.16], [0, floors * 0.9, 0]);
    roof.name = "building-roof";
    movingFloors.push({ group: roof, height: floors * 0.9, index: floors });
    structure.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const base = object.material as THREE.Material;
      let fill = buildingMaterials.get(base);
      if (!fill) {
        fill = base.clone();
        fill.transparent = true;
        buildingMaterials.set(base, fill);
        materials.add(fill);
      }
      object.material = fill;
      const lines = new THREE.LineSegments(edges, wireMaterial);
      lines.visible = false;
      object.add(lines);
      wireEdges.push(lines);
    });
  }

  function crane(x = -2.65, z = -0.4) {
    const tower = new THREE.Group();
    tower.name = "tower-crane";
    tower.position.set(x, 0.28, z);
    root.add(tower);
    register(tower, "crane", "Animate crane lift");
    box(tower, concrete, [1.1, 0.25, 1.1], [0, 0, 0], true);
    for (const x of [-0.22, 0.22]) {
      for (const z of [-0.22, 0.22]) box(tower, red, [0.07, 5.8, 0.07], [x, 2.9, z]);
    }
    for (let i = 0; i < 9; i++) {
      const y = i * 0.64;
      for (const z of [-0.22, 0.22]) {
        beam(tower, new THREE.Vector3(-0.22, y, z), new THREE.Vector3(0.22, y + 0.64, z));
        box(tower, red, [0.5, 0.045, 0.045], [0, y, z]);
      }
    }
    jib = new THREE.Group();
    jib.position.y = 5.8;
    tower.add(jib);
    box(jib, red, [6.7, 0.1, 0.36], [1.6, 0, 0]);
    box(jib, red, [6.7, 0.06, 0.06], [1.6, 0.36, 0]);
    for (let i = -1; i < 5; i++) {
      beam(jib, new THREE.Vector3(i, 0, 0), new THREE.Vector3(i + 0.5, 0.36, 0));
      beam(jib, new THREE.Vector3(i + 0.5, 0.36, 0), new THREE.Vector3(i + 1, 0, 0));
    }
    box(jib, concrete, [0.8, 0.52, 0.8], [-1.15, -0.26, 0], true);
    box(jib, glass, [0.55, 0.65, 0.65], [0.55, -0.35, 0], true);
    hoistCable = box(jib, steel, [0.025, 2.4, 0.025], [3.8, -1.2, 0]);
    hoistCable.name = "tower-crane-cable";
    hoistLoad = new THREE.Group();
    hoistLoad.position.set(3.8, -2.4, 0);
    jib.add(hoistLoad);
    hoistLoad.name = "tower-crane-load";
    box(hoistLoad, red, [0.2, 0.24, 0.2], [0, 0, 0]);
    box(hoistLoad, concrete, [1.65, 0.25, 1.05], [0, -0.7, 0], true);
    for (const corner of [-0.7, 0.7]) {
      beam(hoistLoad, new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(corner, -0.6, 0));
    }
    beam(jib, new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(4.9, 0.36, 0), 0.025);
    beam(jib, new THREE.Vector3(0, 0.95, 0), new THREE.Vector3(-1.7, 0.36, 0), 0.025);
  }

  function bridge() {
    for (const x of [-2.5, 2.5]) {
      box(root, concrete, [1, 0.22, 2.8], [x, 0.3, 0], true);
      box(root, concrete, [0.65, 1.1, 1.6], [x, 0.9, 0], true);
    }
    box(root, concrete, [7, 0.25, 2.5], [0, 1.5, 0], true);
    box(root, dark, [6.8, 0.03, 1.8], [0, 1.64, 0]);
    for (const x of [-3, -2, -1, 0, 1, 2, 3]) box(root, concrete, [0.45, 0.02, 0.045], [x, 1.67, 0]);
    for (const z of [-1.15, 1.15]) {
      beam(root, new THREE.Vector3(-3.3, 2.9, z), new THREE.Vector3(3.3, 2.9, z), 0.12);
      for (let x = -3; x < 3; x++) {
        beam(root, new THREE.Vector3(x, 1.65, z), new THREE.Vector3(x + 0.5, 2.9, z), 0.08);
        beam(root, new THREE.Vector3(x + 0.5, 2.9, z), new THREE.Vector3(x + 1, 1.65, z), 0.08);
      }
    }
    carrier = new THREE.Group();
    carrier.position.set(0, 1.87, -0.4);
    root.add(carrier);
    box(carrier, red, [0.65, 0.3, 0.45], [0, 0, 0], true);
    box(carrier, glass, [0.28, 0.25, 0.4], [-0.12, 0.25, 0]);
    for (const x of [-0.23, 0.23]) box(carrier, steel, [0.12, 0.12, 0.55], [x, -0.13, 0]);
  }

  function safetyEquipment() {
    const helmet = new THREE.Group();
    helmet.position.set(-0.8, 0.4, -0.5);
    root.add(helmet);
    const dome = new THREE.SphereGeometry(1.4, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const brim = new THREE.CylinderGeometry(1.75, 1.75, 0.12, 32);
    const ridge = new THREE.TorusGeometry(1.42, 0.065, 6, 24, Math.PI);
    [dome, brim, ridge].forEach((shape) => geometries.add(shape));
    helmet.add(new THREE.Mesh(dome, red), new THREE.Mesh(brim, red));
    const rib = new THREE.Mesh(ridge, concrete);
    rib.rotation.y = Math.PI / 2;
    helmet.add(rib);
    const barrier = new THREE.Group();
    barrier.position.set(1.35, 0, 1.65);
    root.add(barrier);
    box(barrier, concrete, [3.4, 0.75, 0.16], [0, 1.2, 0], true);
    for (const x of [-1.25, -0.5, 0.25, 1]) {
      box(barrier, red, [0.3, 0.64, 0.18], [x, 1.2, 0]).rotation.z = -0.45;
    }
    for (const x of [-1.25, 1.25]) {
      box(barrier, steel, [0.1, 1.3, 0.1], [x, 0.8, 0]);
      box(barrier, steel, [0.6, 0.12, 0.9], [x, 0.25, 0]);
    }
    const scanMaterial = new THREE.MeshBasicMaterial({ color: 0xef5149, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false });
    materials.add(scanMaterial);
    sweep = box(root, scanMaterial, [3.7, 0.025, 3.5], [-0.8, 1.1, -0.5]);
  }

  const fleet = variant === "equipment";
  const foundation = box(root, dark, [fleet ? 11.8 : 8.2, 0.25, fleet ? 9.4 : 6.8], [0, 0, 0], true);
  foundation.name = "site-foundation";
  box(root, red, [fleet ? 11.85 : 8.25, 0.035, 0.035], [0, 0.14, fleet ? 4.7 : 3.4]);
  const grid = new THREE.GridHelper(fleet ? 11.6 : 8, fleet ? 20 : 16, 0x809094, 0x465255);
  grid.position.y = 0.14;
  grid.scale.z = fleet ? 0.8 : 0.83;
  root.add(grid);
  geometries.add(grid.geometry);
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMaterials.forEach((material) => { material.transparent = true; material.opacity = 0.25; materials.add(material); });

  if (variant === "equipment") {
    updateFleet = createFleet(parts, register, actionProgress);
  } else if (variant === "projects") {
    building(-1.8, -0.7, 4, 2, 2, true);
    building(0.7, 0.1, 6, 2, 2, true);
    building(2.6, 1.5, 2, 1.4, 1.6, true);
  } else if (variant === "about") {
    drawing = createTechnicalDrawing(parts, "masterplan");
    register(root, "masterplan", "Animate master plan");
  } else if (variant === "services") {
    crane(-1.5, -0.6);
    for (const z of [0.9, 2.2]) {
      for (let layer = 0; layer < 3; layer++) box(root, concrete, [2.4, 0.18, 0.8], [-1.2, 0.3 + layer * 0.22, z], true);
    }
  } else if (variant === "detail") {
    bridge();
    register(root, "bridge", "Animate bridge inspection");
  } else if (variant === "compliance") {
    safetyEquipment();
    register(root, "safety", "Animate safety inspection");
  } else if (variant === "contact") {
    drawing = createTechnicalDrawing(parts, "blueprint");
    register(root, "blueprint", "Animate blueprint");
  } else {
    building(0.7, 0, 5, 3.3, 2.8);
    crane();
  }
  const updateWorkers = createWorkers(parts, variant, register, id => actionStarts.get(id));

  return {
    root,
    actions,
    interactiveTargets,
    triggerAction(id: string) {
      if (actions.some(action => action.id === id)) actionStarts.set(id, currentTime);
    },
    update(time: number, _progress = 0, pose: BuildingPose = { wireframe: 0, explosion: 0 }) {
      currentTime = time;
      movingFloors.forEach(({ group, height, index }) => {
        group.position.y = height + pose.explosion * index * 0.35;
      });
      buildingMaterials.forEach(material => {
        material.opacity = 1 - pose.wireframe;
        material.visible = pose.wireframe < 1;
        material.depthWrite = pose.wireframe === 0;
      });
      wireMaterial.opacity = pose.wireframe;
      wireEdges.forEach(lines => { lines.visible = pose.wireframe > 0; });
      if (jib) jib.rotation.y = variant === "home" ? -0.8 + Math.sin(time * 0.22) * 0.04 : Math.sin(time * 0.22) * 0.08;
      if (hoistCable && hoistLoad) {
        const length = 2.4 + Math.sin(time * 0.65) * 0.15 - Math.sin(Math.PI * actionProgress("crane", time)) * 0.85;
        hoistCable.scale.y = length;
        hoistCable.position.y = -length / 2;
        hoistLoad.position.y = -length;
        hoistLoad.rotation.y = -(jib?.rotation.y ?? 0);
      }
      if (sweep) sweep.position.y = 1.05 + Math.sin(time * 0.8 + actionProgress("safety", time) * Math.PI * 2) * 0.75;
      if (carrier) carrier.position.x = Math.sin(time * 0.4 + actionProgress("bridge", time) * Math.PI * 2) * 2.4;
      drawing?.update(time + actionProgress(variant === "about" ? "masterplan" : "blueprint", time) * 6);
      updateFleet?.(time);
      updateWorkers(time);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      drawing?.dispose();
      geometries.forEach((resource) => resource.dispose());
      materials.forEach((resource) => resource.dispose());
      root.clear();
    },
  };
}
