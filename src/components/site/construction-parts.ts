import * as THREE from "three";

export function createSceneParts(root: THREE.Group) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(geometry);
  const materials = {
    concrete: new THREE.MeshStandardMaterial({ color: 0xc6c8c4, roughness: 0.85 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x526269, roughness: 0.45, metalness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: 0xd93832, roughness: 0.5, metalness: 0.2 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x242b2e, roughness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x789a9d, roughness: 0.25, metalness: 0.65 }),
    outline: new THREE.LineBasicMaterial({ color: 0x111b20, transparent: true, opacity: 0.3 }),
  };
  const geometries = new Set<THREE.BufferGeometry>([geometry, edges]);
  const resources = new Set<THREE.Material>(Object.values(materials));

  function box(parent: THREE.Object3D, material: THREE.Material, size: number[], position: number[], outlined = false) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(size[0], size[1], size[2]);
    mesh.position.set(position[0], position[1], position[2]);
    if (outlined) mesh.add(new THREE.LineSegments(edges, materials.outline));
    parent.add(mesh);
    return mesh;
  }

  function beam(parent: THREE.Object3D, start: THREE.Vector3, end: THREE.Vector3, width = 0.06) {
    const mesh = box(parent, materials.red, [width, start.distanceTo(end), width], start.clone().add(end).multiplyScalar(0.5).toArray());
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
  }

  return { root, geometry, edges, materials, geometries, resources, box, beam };
}

export type SceneParts = ReturnType<typeof createSceneParts>;
export type RegisterAction = (object: THREE.Object3D, id: string, label: string) => void;
export type ActionProgress = (id: string, time: number) => number;
