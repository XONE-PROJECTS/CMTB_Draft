import * as THREE from "three";
import type { SceneParts, RegisterAction } from "./construction-parts";
import type { SceneVariant } from "./construction-model";

type Route = { x: number; z: number; rx: number; rz: number; ground: number; scale: number };

export function createWorkers(parts: SceneParts, variant: SceneVariant, register: RegisterAction, actionStart: (id: string) => number | undefined) {
  const routes: Partial<Record<SceneVariant, Route[]>> = {
    home: [{ x: -2.4, z: -2.45, rx: 0.7, rz: 0.25, ground: 0.14, scale: 0.8 }, { x: 3.25, z: -0.5, rx: 0.22, rz: 0.7, ground: 0.14, scale: 0.8 }],
    about: [{ x: -0.18, z: -1.4, rx: 0.05, rz: 0.6, ground: 0.33, scale: 0.6 }, { x: 0.18, z: 1.4, rx: 0.05, rz: 0.6, ground: 0.33, scale: 0.6 }],
    services: [{ x: -3.2, z: 1.6, rx: 0.25, rz: 0.6, ground: 0.14, scale: 0.8 }, { x: 2.9, z: 2.3, rx: 0.45, rz: 0.22, ground: 0.14, scale: 0.8 }],
    equipment: [{ x: -2, z: 4.1, rx: 0.75, rz: 0.15, ground: 0.14, scale: 0.85 }, { x: 2.2, z: 4.1, rx: 0.75, rz: 0.15, ground: 0.14, scale: 0.85 }],
    projects: [{ x: -2.6, z: 2.8, rx: 0.6, rz: 0.18, ground: 0.14, scale: 0.75 }, { x: 1.1, z: 2.8, rx: 0.6, rz: 0.18, ground: 0.14, scale: 0.75 }],
    detail: [{ x: 0, z: -0.98, rx: 2.4, rz: 0.015, ground: 1.65, scale: 0.55 }, { x: 0, z: 0.98, rx: 2.4, rz: 0.015, ground: 1.65, scale: 0.55 }],
  };
  const selected = routes[variant];
  if (!selected) return () => {};
  const { box, root, geometries, resources } = parts;
  const { red, steel, dark, concrete } = parts.materials;
  const skin = new THREE.MeshStandardMaterial({ color: 0xd6ae8b, roughness: 0.9 });
  const helmet = new THREE.MeshStandardMaterial({ color: 0xf4c34f, roughness: 0.7 });
  resources.add(skin);
  resources.add(helmet);
  const headShape = new THREE.SphereGeometry(0.09, 10, 8);
  const hatShape = new THREE.SphereGeometry(0.11, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const brimShape = new THREE.CylinderGeometry(0.13, 0.13, 0.025, 12);
  [headShape, hatShape, brimShape].forEach(shape => geometries.add(shape));

  const workers = selected.map((route, index) => {
    const worker = new THREE.Group();
    worker.name = `worker-${index + 1}`;
    worker.scale.setScalar(route.scale);
    worker.userData.ground = route.ground;
    root.add(worker);
    register(worker, worker.name, `Wave to worker ${index + 1}`);
    box(worker, red, [0.18, 0.25, 0.12], [0, 0.445, 0]);
    box(worker, concrete, [0.185, 0.035, 0.125], [0, 0.42, 0]);
    box(worker, dark, [0.18, 0.06, 0.13], [0, 0.32, 0]);
    const head = new THREE.Mesh(headShape, skin);
    head.position.y = 0.65;
    const hat = new THREE.Mesh(hatShape, helmet);
    hat.position.y = 0.69;
    const brim = new THREE.Mesh(brimShape, helmet);
    brim.position.y = 0.69;
    worker.add(head, hat, brim);
    const arms: THREE.Group[] = [];
    const legs: THREE.Group[] = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.125, 0.53, 0);
      worker.add(arm);
      box(arm, steel, [0.065, 0.22, 0.065], [0, -0.11, 0]);
      const hand = new THREE.Mesh(headShape, skin);
      hand.scale.setScalar(0.4);
      hand.position.y = -0.24;
      arm.add(hand);
      arms.push(arm);
      const leg = new THREE.Group();
      leg.position.set(side * 0.055, 0.32, 0);
      worker.add(leg);
      box(leg, dark, [0.07, 0.24, 0.075], [0, -0.12, 0]);
      const boot = box(leg, dark, [0.08, 0.055, 0.12], [0, -0.265, 0.02]);
      boot.name = `${worker.name}-boot`;
      legs.push(leg);
    }
    return { worker, arms, legs, route, walkTime: index * 4, lastTime: 0 };
  });

  return (time: number) => {
    workers.forEach(state => {
      const { worker, arms, legs, route } = state;
      const delta = Math.max(0, time - state.lastTime);
      state.lastTime = time;
      const start = actionStart(worker.name);
      const waving = start !== undefined && time - start < 2.4;
      if (!waving) state.walkTime += delta;
      const angle = state.walkTime * 0.28;
      worker.position.set(route.x + Math.cos(angle) * route.rx, route.ground, route.z + Math.sin(angle) * route.rz);
      worker.rotation.y = Math.atan2(-Math.sin(angle) * route.rx, Math.cos(angle) * route.rz);
      const stride = waving ? 0 : Math.sin(state.walkTime * 5) * 0.38;
      legs[0].rotation.x = stride;
      legs[1].rotation.x = -stride;
      for (const leg of legs) {
        const cos = Math.cos(leg.rotation.x), sin = Math.sin(leg.rotation.x);
        // Keep the rotated boot sole on the route's ground or bridge-deck plane.
        leg.position.y = 0.265 * cos + 0.02 * sin + 0.0275 * Math.abs(cos) + 0.06 * Math.abs(sin);
      }
      arms[0].rotation.x = -stride;
      arms[1].rotation.x = stride;
      arms[1].rotation.z = waving ? -2.3 + Math.sin((time - start) * 10) * 0.3 : 0;
    });
  };
}
