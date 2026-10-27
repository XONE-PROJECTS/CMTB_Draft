import * as THREE from "three";
import { createConstructionModel, type SceneAction, type SceneVariant } from "./construction-model";
import { buildingPlayback, stagePoses, stageTimes, smoothProgress, isSceneDrag, type BuildingPose, type BuildingStage } from "./construction-playback";

export type SceneStatus = { ready: boolean; paused: boolean; reduced: boolean; stage: BuildingStage; actions: SceneAction[] };
export type SceneController = {
  rotate: (direction: number) => void;
  triggerAction: (id: string) => void;
  selectStage: (stage: BuildingStage) => void;
  togglePause: () => void;
  replay: () => void;
  dispose: () => void;
};

export function createSceneRuntime(host: HTMLDivElement, variant: SceneVariant, onStatus: (status: SceneStatus) => void): SceneController {
  const hasBuilding = variant === "home" || variant === "projects";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  const viewport = host.parentElement;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  } catch {
    host.dataset.state = "fallback";
    onStatus({ ready: false, paused: true, reduced: reduced.matches, stage: "assembled", actions: [] });
    return { rotate() {}, triggerAction() {}, selectStage() {}, togglePause() {}, replay() {}, dispose() {} };
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xe7f4ff, 0x303235, 2.6));
  const key = new THREE.DirectionalLight(0xffedda, 4.2);
  key.position.set(-3, 7, 5);
  const rim = new THREE.DirectionalLight(0x9cbdce, 2.2);
  rim.position.set(5, 4, -5);
  scene.add(key, rim);
  const model = createConstructionModel(variant);
  model.update(0, 0, { wireframe: 0, explosion: 1 });
  const bounds = new THREE.Box3().setFromObject(model.root).expandByScalar(variant === "equipment" ? 0.6 : 0.2);
  const centre = bounds.getCenter(new THREE.Vector3());
  centre.y = bounds.min.y + (bounds.max.y - bounds.min.y) * 0.4;
  const fitPoints: THREE.Vector3[] = [];
  model.root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.computeBoundingBox();
    const box = object.geometry.boundingBox!;
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
      fitPoints.push(new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld).sub(centre));
    }
  });
  model.update(0);
  model.root.position.sub(centre);
  const pivot = new THREE.Group();
  pivot.add(model.root);
  scene.add(pivot);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 0.015;
  const point = new THREE.Vector2();
  const viewDirection = (variant === "about" || variant === "contact" ? new THREE.Vector3(0.8, 1.1, 1) : new THREE.Vector3(1, 0.7, 1.2)).normalize();
  const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), viewDirection).normalize();
  const upDirection = new THREE.Vector3().crossVectors(viewDirection, right);
  let visible = true;
  let lost = false;
  let disposed = false;
  let paused = false;
  let automatic = true;
  let elapsed = 0;
  let cycle = 0;
  let lastTime = 0;
  let yaw = -0.22;
  let stage: BuildingStage = "assembled";
  let pose: BuildingPose = { ...stagePoses.assembled };
  let transition: { from: BuildingPose; to: BuildingPose; time: number } | undefined;
  let drag: { id: number; x: number; y: number; yaw: number; moved: boolean } | undefined;

  function announce() {
    host.dataset.stage = stage;
    host.dataset.paused = String(paused || reduced.matches);
    onStatus({ ready: !lost, paused: paused || reduced.matches, reduced: reduced.matches, stage, actions: model.actions });
  }

  function render() {
    model.update(elapsed, 0, pose);
    pivot.rotation.y = yaw;
    renderer.render(scene, camera);
  }

  function frame(time: number) {
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    if (!paused) {
      elapsed += delta;
      if (hasBuilding && automatic) {
        cycle += delta;
        const next = buildingPlayback(cycle);
        pose = { wireframe: next.wireframe, explosion: next.explosion };
        if (stage !== next.stage) { stage = next.stage; announce(); }
      }
    }
    if (transition) {
      transition.time += delta;
      const amount = smoothProgress(transition.time / 0.8);
      pose = {
        wireframe: THREE.MathUtils.lerp(transition.from.wireframe, transition.to.wireframe, amount),
        explosion: THREE.MathUtils.lerp(transition.from.explosion, transition.to.explosion, amount),
      };
      if (transition.time >= 0.8) { transition = undefined; syncLoop(); }
    }
    render();
  }

  function syncLoop() {
    renderer.setAnimationLoop(null);
    lastTime = 0;
    const running = !lost && visible && !document.hidden && !reduced.matches && (!paused || Boolean(transition));
    host.dataset.state = lost ? "fallback" : "ready";
    host.dataset.animating = String(running);
    if (viewport) viewport.dataset.running = String(running && !paused);
    if (!lost && visible && !document.hidden) render();
    if (running) renderer.setAnimationLoop(frame);
  }

  function rotate(direction: number) {
    yaw += direction * Math.PI / 12;
    host.dataset.rotation = String(yaw);
    if (!lost) render();
  }

  function replay() {
    stage = "assembled";
    pose = { ...stagePoses.assembled };
    cycle = 0;
    automatic = true;
    transition = undefined;
    paused = false;
    if (!hasBuilding && !reduced.matches && model.actions[0]) model.triggerAction(model.actions[0].id);
    announce();
    syncLoop();
  }

  function triggerAction(id: string) {
    if (lost || reduced.matches) return;
    host.dataset.action = id;
    if (id === "building") { replay(); return; }
    model.triggerAction(id);
    paused = false;
    announce();
    syncLoop();
  }

  function selectStage(next: BuildingStage) {
    if (!hasBuilding) return;
    automatic = false;
    paused = true;
    stage = next;
    if (reduced.matches) { pose = { ...stagePoses[next] }; transition = undefined; }
    else transition = { from: { ...pose }, to: { ...stagePoses[next] }, time: 0 };
    announce();
    syncLoop();
  }

  function togglePause() {
    if (reduced.matches) return;
    paused = !paused;
    if (!paused && hasBuilding && !automatic) {
      automatic = true;
      cycle = stageTimes[stage];
      pose = { ...stagePoses[stage] };
      transition = undefined;
    }
    announce();
    syncLoop();
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, desktop.matches ? 1.5 : 1));
    renderer.setSize(width, height);
    camera.aspect = width / height;
    const vertical = THREE.MathUtils.degToRad(camera.fov);
    const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
    let distance = 1;
    const allowance = variant === "equipment" ? 0.7 : 0.15;
    // Fit actual parts at every viewing angle, including the fully exploded pose.
    for (let angle = 0; angle < 16; angle++) {
      const cos = Math.cos(angle * Math.PI / 8), sin = Math.sin(angle * Math.PI / 8);
      for (const p of fitPoints) {
        const x = p.x * cos + p.z * sin, z = -p.x * sin + p.z * cos;
        const depth = x * viewDirection.x + p.y * viewDirection.y + z * viewDirection.z;
        const horizontalExtent = Math.abs(x * right.x + z * right.z);
        const verticalExtent = Math.abs(x * upDirection.x + p.y * upDirection.y + z * upDirection.z);
        distance = Math.max(distance, depth + (horizontalExtent + allowance) / Math.tan(horizontal / 2), depth + (verticalExtent + allowance) / Math.tan(vertical / 2));
      }
    }
    camera.position.copy(viewDirection).multiplyScalar(distance * 1.04);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (!lost) render();
  }

  const down = (event: PointerEvent) => {
    if (event.button !== 0 || lost) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, moved: false };
    host.setPointerCapture?.(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    drag.moved ||= isSceneDrag(drag.x, drag.y, event.clientX, event.clientY);
    if (drag.moved && (event.pointerType !== "touch" || Math.abs(event.clientX - drag.x) >= Math.abs(event.clientY - drag.y))) {
      yaw = drag.yaw + (event.clientX - drag.x) * 0.01;
      host.dataset.rotation = String(yaw);
      host.dataset.dragging = "true";
      render();
    }
  };
  const up = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const clicked = !drag.moved && !isSceneDrag(drag.x, drag.y, event.clientX, event.clientY);
    drag = undefined;
    host.dataset.dragging = "false";
    if (host.hasPointerCapture?.(event.pointerId)) host.releasePointerCapture(event.pointerId);
    if (!clicked) return;
    const rect = host.getBoundingClientRect();
    point.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(point, camera);
    const hits = raycaster.intersectObjects(model.interactiveTargets, true);
    let object: THREE.Object3D | null = hits[0]?.object ?? null;
    while (object && !object.userData.actionId) object = object.parent;
    if (object) triggerAction(object.userData.actionId);
  };
  const cancel = () => { drag = undefined; host.dataset.dragging = "false"; };
  let keyboardAction = 0;
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); rotate(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === " ") {
      event.preventDefault(); togglePause();
    } else if (event.key === "Enter" && model.actions.length) {
      event.preventDefault(); triggerAction(model.actions[keyboardAction++ % model.actions.length].id);
    }
  };
  const preference = () => {
    if (reduced.matches) { pose = { ...stagePoses.assembled }; stage = "assembled"; cycle = 0; transition = undefined; }
    announce(); syncLoop();
  };
  const onLost = (event: Event) => { event.preventDefault(); lost = true; announce(); syncLoop(); };
  const onRestored = () => { lost = false; resize(); announce(); syncLoop(); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncLoop(); });
  const resizeObserver = new ResizeObserver(resize);
  observer.observe(host);
  resizeObserver.observe(host);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", cancel);
  host.addEventListener("keydown", onKey);
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored);
  document.addEventListener("visibilitychange", syncLoop);
  reduced.addEventListener("change", preference);
  desktop.addEventListener("change", resize);
  resize(); announce(); syncLoop();

  return {
    rotate, triggerAction, selectStage, togglePause, replay,
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect(); resizeObserver.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", cancel);
      host.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", syncLoop);
      reduced.removeEventListener("change", preference);
      desktop.removeEventListener("change", resize);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      renderer.setAnimationLoop(null);
      if (viewport) viewport.dataset.running = "false";
      model.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
