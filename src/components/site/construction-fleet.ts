import * as THREE from "three";
import type { SceneParts, RegisterAction, ActionProgress } from "./construction-parts";
import { smoothProgress } from "./construction-playback";

export function createFleet(parts: SceneParts, register: RegisterAction, progress: ActionProgress) {
  const { root, box, geometries } = parts;
  const { red, concrete, steel, dark, glass } = parts.materials;
  const tireGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.32, 16);
  geometries.add(tireGeometry);

  function truck(id: string, label: string, x: number, z: number) {
    const group = new THREE.Group();
    group.name = id;
    group.scale.setScalar(0.7);
    group.position.set(x, 0.49, z);
    root.add(group);
    register(group, id, label);
    const chassis = box(group, steel, [5.4, 0.3, 1.65], [0, 0.25, 0], true);
    chassis.name = `${id}-chassis`;
    box(group, red, [1.45, 1.65, 1.8], [-1.9, 1.2, 0], true);
    box(group, glass, [1.48, 0.65, 1.65], [-1.91, 1.5, 0]);
    box(group, concrete, [0.12, 0.25, 1.9], [-2.68, 0.3, 0]);
    const wheels = new THREE.Group();
    wheels.name = `${id}-wheels`;
    group.add(wheels);
    for (const wheelX of [-1.8, 1.05, 2.05]) {
      for (const wheelZ of [-0.9, 0.9]) {
        const wheel = new THREE.Mesh(tireGeometry, dark);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(wheelX, 0, wheelZ);
        wheels.add(wheel);
        const hub = new THREE.Mesh(tireGeometry, steel);
        hub.scale.set(0.46, 1.04, 0.46);
        wheel.add(hub);
      }
    }
    return group;
  }

  const mixer = truck("mixer", "Animate mixer", -2.7, -2.25);
  const mount = new THREE.Group();
  mount.name = "mixer-mount";
  mount.position.set(0.7, 1.45, 0);
  mount.rotation.z = -0.18;
  mixer.add(mount);
  const alignment = new THREE.Group();
  alignment.rotation.z = Math.PI / 2;
  mount.add(alignment);
  const drum = new THREE.Group();
  drum.name = "mixer-drum";
  alignment.add(drum);
  const drumGeometry = new THREE.CylinderGeometry(1.03, 0.65, 2.8, 24);
  const stripeGeometry = new THREE.CylinderGeometry(1.038, 0.658, 2.8, 24, 1, true, 0, 0.3);
  geometries.add(drumGeometry);
  geometries.add(stripeGeometry);
  drum.add(new THREE.Mesh(drumGeometry, concrete));
  for (const angle of [0, Math.PI]) {
    const stripe = new THREE.Mesh(stripeGeometry, red);
    stripe.rotation.y = angle;
    drum.add(stripe);
  }
  const marking = box(drum, red, [0.04, 0.18, 0.14], [0.85, 0, 0]);
  marking.name = "mixer-marking";
  const chute = box(mixer, steel, [1.1, 0.15, 0.45], [2.75, 0.8, 0]);
  chute.name = "mixer-chute";
  chute.rotation.z = -0.5;

  const excavator = new THREE.Group();
  excavator.name = "excavator";
  excavator.position.set(2.1, 0.14, -2.4);
  excavator.scale.setScalar(0.7);
  root.add(excavator);
  register(excavator, "excavator", "Animate excavator");
  for (const z of [-0.8, 0.8]) {
    box(excavator, dark, [2.9, 0.5, 0.45], [0, 0.28, z], true);
    for (const x of [-1, -0.5, 0, 0.5, 1]) {
      const roller = new THREE.Mesh(tireGeometry, steel);
      roller.rotation.x = Math.PI / 2;
      roller.scale.set(0.45, 1.5, 0.45);
      roller.position.set(x, 0.28, z);
      excavator.add(roller);
    }
  }
  const house = new THREE.Group();
  house.position.y = 0.6;
  excavator.add(house);
  box(house, red, [1.45, 0.7, 1.5], [0.2, 0.4, 0], true);
  box(house, glass, [0.9, 1.05, 1.1], [-0.65, 0.9, 0], true);
  const boom = new THREE.Group();
  boom.name = "excavator-boom";
  boom.position.set(0.65, 0.5, 0.2);
  house.add(boom);
  box(boom, red, [2, 0.25, 0.28], [1, 0, 0], true);
  const stick = new THREE.Group();
  stick.name = "excavator-stick";
  stick.position.x = 2;
  boom.add(stick);
  box(stick, red, [1.6, 0.19, 0.22], [0.8, 0, 0], true);
  const bucket = new THREE.Group();
  bucket.name = "excavator-bucket";
  bucket.position.x = 1.6;
  stick.add(bucket);
  box(bucket, steel, [0.65, 0.08, 0.8], [0.25, -0.22, 0], true);
  box(bucket, steel, [0.1, 0.5, 0.8], [-0.025, 0, 0]);
  for (const z of [-0.36, 0.36]) box(bucket, steel, [0.65, 0.45, 0.08], [0.25, -0.02, z]);
  for (const z of [-0.3, -0.1, 0.1, 0.3]) box(bucket, steel, [0.15, 0.07, 0.07], [0.6, -0.22, z]);

  const dumper = truck("dump-truck", "Animate dump truck", -2.7, 2.0);
  const bed = new THREE.Group();
  bed.name = "dump-bed";
  bed.position.set(2, 0.65, 0);
  dumper.add(bed);
  box(bed, concrete, [3.1, 0.15, 1.85], [-1.55, 0, 0], true);
  for (const z of [-0.9, 0.9]) box(bed, red, [3.1, 0.7, 0.12], [-1.55, 0.4, z], true);
  for (const x of [-3.05, 0]) box(bed, red, [0.12, 0.7, 1.85], [x, 0.4, 0], true);

  const mobile = truck("mobile-crane", "Animate mobile crane", 2.5, 2.0);
  for (const x of [-1.2, 1.4]) {
    box(mobile, steel, [0.15, 0.15, 2.9], [x, -0.05, 0]);
    for (const z of [-1.4, 1.4]) box(mobile, dark, [0.45, 0.15, 0.45], [x, -0.4, z]);
  }
  box(mobile, red, [1.5, 0.7, 1.5], [0.5, 0.7, 0], true);
  const craneBoom = new THREE.Group();
  craneBoom.name = "mobile-crane-boom";
  craneBoom.position.set(0.3, 1, 0);
  mobile.add(craneBoom);
  box(craneBoom, concrete, [3.2, 0.3, 0.35], [1.6, 0, 0], true);
  box(craneBoom, red, [2, 0.2, 0.24], [3.4, 0, 0], true);
  const tip = new THREE.Object3D();
  tip.name = "mobile-crane-tip";
  tip.position.x = 4.4;
  craneBoom.add(tip);
  const cable = box(mobile, steel, [0.025, 1, 0.025], [0, 0, 0]);
  cable.name = "mobile-crane-cable";
  const load = new THREE.Group();
  load.name = "mobile-crane-load";
  mobile.add(load);
  box(load, red, [0.15, 0.2, 0.15], [0, 0, 0]);
  box(load, concrete, [0.7, 0.45, 0.65], [0, -0.35, 0], true);
  let lastTime = 0;
  let drumAngle = 0;
  const anchor = new THREE.Vector3();

  return (time: number) => {
    const delta = Math.max(0, time - lastTime);
    lastTime = time;
    drumAngle += delta * (0.4 + Math.sin(Math.PI * progress("mixer", time)) * 2.8);
    drum.rotation.y = drumAngle;
    const dig = progress("excavator", time);
    const lower = Math.sin(Math.PI * dig);
    const curl = Math.sin(Math.PI * smoothProgress(Math.max(0, (dig - 0.25) / 0.75)));
    boom.rotation.z = 1.1 - lower * 0.52;
    stick.rotation.z = -1.7 + lower * 0.05 - curl * 0.2;
    bucket.rotation.z = 0.2 + curl * 1.1;
    bed.rotation.z = -Math.sin(Math.PI * progress("dump-truck", time)) * 0.65;
    const lift = Math.sin(Math.PI * progress("mobile-crane", time));
    craneBoom.rotation.z = 0.68 + lift * 0.25;
    root.updateMatrixWorld(true);
    mobile.worldToLocal(tip.getWorldPosition(anchor));
    const length = 1.25 - lift * 0.35;
    cable.scale.y = length;
    cable.position.copy(anchor);
    cable.position.y -= length / 2;
    load.position.copy(anchor);
    load.position.y -= length;
  };
}
