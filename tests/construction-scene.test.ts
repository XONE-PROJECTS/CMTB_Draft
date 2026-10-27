import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Mesh, Object3D, Raycaster, Vector3 } from "three";
import type { SceneController } from "../src/components/site/construction-runtime";
import type { SceneVariant } from "../src/components/site/construction-model";

const harness = vi.hoisted(() => ({
  setup: undefined as undefined | (() => (() => void) | void),
  host: undefined as unknown,
  renderer: undefined as any,
  intersect: undefined as any,
  fail: false,
  controller: undefined as SceneController | undefined,
  frameTime: 1000,
}));

vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useRef: () => ({ current: harness.host }),
  useEffect: (setup: () => (() => void) | void) => { harness.setup = setup; },
}));
vi.mock("gsap", () => ({ gsap: { registerPlugin: vi.fn(), to: vi.fn(() => ({ revert: vi.fn() })) } }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("three", async (original) => ({
  ...await original<typeof import("three")>(),
  WebGLRenderer: class {
    domElement = Object.assign(new EventTarget(), { setAttribute: vi.fn(), remove: vi.fn() });
    setClearColor = vi.fn();
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn((scene: Object3D, camera: Object3D) => { scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); });
    setAnimationLoop = vi.fn();
    dispose = vi.fn();
    forceContextLoss = vi.fn();
    constructor() {
      if (harness.fail) throw new Error("WebGL unavailable");
      harness.renderer = this;
    }
  },
}));

import ConstructionScene from "../src/components/site/ConstructionScene";

describe("construction scene lifecycle", () => {
  let host: EventTarget & { dataset: Record<string, string> };
  let reduced: EventTarget & { matches: boolean };
  let desktop: EventTarget & { matches: boolean };
  let page: EventTarget & { hidden: boolean };
  let disconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    harness.fail = false;
    harness.frameTime = 1000;
    disconnect = vi.fn();
    const section = new EventTarget();
    host = Object.assign(new EventTarget(), {
      dataset: {},
      parentElement: { dataset: {} },
      appendChild: vi.fn(),
      closest: () => section,
      getBoundingClientRect: () => ({ width: 500, height: 460, left: 0, top: 0 }),
    });
    reduced = Object.assign(new EventTarget(), { matches: false });
    desktop = Object.assign(new EventTarget(), { matches: true });
    page = Object.assign(new EventTarget(), { hidden: false });
    harness.host = host;
    vi.stubGlobal("document", page);
    vi.stubGlobal("window", {
      devicePixelRatio: 3,
      matchMedia: (query: string) => query.includes("reduced-motion") ? reduced : desktop,
    });
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: unknown) { harness.intersect = callback; }
      observe = vi.fn();
      disconnect = disconnect;
    });
    vi.stubGlobal("ResizeObserver", class {
      observe = vi.fn();
      disconnect = disconnect;
    });
  });

  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.clearAllMocks(); });

  function mount(variant: SceneVariant = "home") {
    ConstructionScene({ variant, onReady: controller => { harness.controller = controller ?? undefined; } });
    return harness.setup?.();
  }

  it.each(["home", "about", "services", "equipment", "projects", "detail", "compliance", "contact"] as SceneVariant[])("keeps the entire %s model in frame through rotation and actions", variant => {
    const cleanup = mount(variant);
    const controller = harness.controller!;
    const [scene] = harness.renderer.render.mock.calls.at(-1);
    const model = scene.children.find((object: Object3D) => object.type === "Group").children[0];
    if (variant === "home" || variant === "projects") { controller.selectStage("exploded"); advanceFrames(24); }
    for (const object of model.children) {
      if (object.userData.actionId) controller.triggerAction(object.userData.actionId);
    }
    for (const size of [[280, 260], [532, 360], [640, 450]]) {
      (host as any).getBoundingClientRect = () => ({ width: size[0], height: size[1], left: 0, top: 0 });
      desktop.dispatchEvent(new Event("change"));
      for (let step = 0; step < 24; step++) {
        controller.rotate(1);
        advanceFrames(4);
        const [, camera] = harness.renderer.render.mock.calls.at(-1);
        scene.traverse((object: Object3D) => {
          if (!(object instanceof Mesh)) return;
          object.geometry.computeBoundingBox();
          const bounds = object.geometry.boundingBox!;
          for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
            const point = new Vector3(x, y, z).applyMatrix4(object.matrixWorld).project(camera);
            expect(Math.abs(point.x)).toBeLessThan(1);
            expect(Math.abs(point.y)).toBeLessThan(1);
          }
        });
      }
    }
    if (typeof cleanup === "function") cleanup();
  });

  it("leaves vertical touch drags to scrolling and does not trigger an action", () => {
    const cleanup = mount();
    const pointer = (type: string, x: number, y: number) => host.dispatchEvent(Object.assign(new Event(type), {
      pointerId: 2, button: 0, clientX: x, clientY: y, pointerType: "touch",
    }));
    pointer("pointerdown", 100, 100); pointer("pointermove", 102, 180); pointer("pointercancel", 102, 180);
    expect(host.dataset.rotation).toBeUndefined();
    expect(host.dataset.action).toBeUndefined();
    if (typeof cleanup === "function") cleanup();
  });

  it("supports keyboard rotation, pausing and actions without visible buttons", () => {
    const cleanup = mount();
    const key = (value: string) => host.dispatchEvent(Object.assign(new Event("keydown", { cancelable: true }), { key: value }));
    key("ArrowRight");
    expect(host.dataset.rotation).toBeDefined();
    key(" ");
    expect(host.dataset.animating).toBe("false");
    key(" ");
    expect(host.dataset.animating).toBe("true");
    key("Enter");
    expect(host.dataset.action).toBe("building");
    if (typeof cleanup === "function") cleanup();
  });

  it("picks the mixer body precisely without selecting a neighboring truck outline", () => {
    const cleanup = mount("equipment");
    const [scene, camera] = harness.renderer.render.mock.calls.at(-1);
    const drum = scene.getObjectByName("mixer-drum");
    const screen = drum.getWorldPosition(new Vector3()).project(camera);
    const x = (screen.x + 1) * 250, y = (1 - screen.y) * 230;
    const pointer = (type: string) => host.dispatchEvent(Object.assign(new Event(type), {
      pointerId: 1, button: 0, clientX: x, clientY: y, pointerType: "mouse",
    }));
    pointer("pointerdown"); pointer("pointerup");
    expect(host.dataset.action).toBe("mixer");
    if (typeof cleanup === "function") cleanup();
  });

  function advanceFrames(count: number) {
    for (let i = 0; i < count; i++) {
      const callback = harness.renderer.setAnimationLoop.mock.calls.at(-1)?.[0];
      if (typeof callback !== "function") break;
      harness.frameTime += 50;
      callback(harness.frameTime);
    }
  }

  it("changes building stages without recreating the canvas and preserves user rotation", () => {
    const cleanup = mount();
    const controller = harness.controller!;
    controller.rotate(1);
    const rotation = host.dataset.rotation;
    controller.selectStage("exploded");
    advanceFrames(24);
    const scene = harness.renderer.render.mock.calls.at(-1)[0] as Object3D;
    expect(scene.getObjectByName("building-roof")!.position.y).toBeCloseTo(6.25);
    expect(host.dataset.stage).toBe("exploded");
    expect(host.dataset.animating).toBe("false");
    controller.selectStage("reassembled");
    advanceFrames(24);
    expect(scene.getObjectByName("building-roof")!.position.y).toBe(4.5);
    expect(host.dataset.rotation).toBe(rotation);
    expect((host as any).appendChild).toHaveBeenCalledOnce();
    controller.togglePause();
    expect(host.dataset.animating).toBe("true");
    if (typeof cleanup === "function") cleanup();
  });

  it("does not activate a model after dragging but activates one on a click", () => {
    const cleanup = mount();
    const hit = new Object3D();
    hit.userData.actionId = "worker-1";
    const raycast = vi.spyOn(Raycaster.prototype, "intersectObjects").mockReturnValue([{ object: hit }] as any);
    const pointer = (type: string, x: number, y: number) => host.dispatchEvent(Object.assign(new Event(type), {
      pointerId: 1, button: 0, clientX: x, clientY: y, pointerType: "mouse",
    }));
    pointer("pointerdown", 100, 100); pointer("pointermove", 160, 100); pointer("pointerup", 160, 100);
    expect(raycast).not.toHaveBeenCalled();
    expect(host.dataset.rotation).toBeDefined();
    pointer("pointerdown", 100, 100); pointer("pointerup", 102, 101);
    expect(host.dataset.action).toBe("worker-1");
    if (typeof cleanup === "function") cleanup();
  });

  it("changes stages immediately under reduced motion and still permits rotation", () => {
    reduced.matches = true;
    const cleanup = mount();
    harness.controller!.selectStage("exploded");
    const scene = harness.renderer.render.mock.calls.at(-1)[0] as Object3D;
    expect(scene.getObjectByName("building-roof")!.position.y).toBeCloseTo(6.25);
    expect(host.dataset.animating).toBe("false");
    harness.controller!.rotate(1);
    expect(host.dataset.rotation).toBeDefined();
    if (typeof cleanup === "function") cleanup();
  });

  it("caps resolution, pauses offscreen and in background, and removes resources", () => {
    const cleanup = mount();
    const renderer = harness.renderer;
    expect(renderer.setPixelRatio).toHaveBeenLastCalledWith(1.5);
    expect(host.dataset.animating).toBe("true");
    harness.intersect([{ isIntersecting: false }]);
    expect(renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
    expect(host.dataset.animating).toBe("false");
    harness.intersect([{ isIntersecting: true }]);
    expect(host.dataset.animating).toBe("true");
    page.hidden = true;
    page.dispatchEvent(new Event("visibilitychange"));
    expect(host.dataset.animating).toBe("false");
    desktop.matches = false;
    desktop.dispatchEvent(new Event("change"));
    expect(renderer.setPixelRatio).toHaveBeenLastCalledWith(1);
    if (typeof cleanup === "function") cleanup();
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(renderer.dispose).toHaveBeenCalledOnce();
    expect(renderer.forceContextLoss).toHaveBeenCalledOnce();
    expect(renderer.domElement.remove).toHaveBeenCalledOnce();
    renderer.setAnimationLoop.mockClear();
    page.dispatchEvent(new Event("visibilitychange"));
    expect(renderer.setAnimationLoop).not.toHaveBeenCalled();
  });

  it("renders a static scene and responds live to reduced motion", () => {
    reduced.matches = true;
    const cleanup = mount();
    expect(harness.renderer.render).toHaveBeenCalled();
    expect(host.dataset.state).toBe("ready");
    expect(host.dataset.animating).toBe("false");
    expect(harness.renderer.setAnimationLoop).toHaveBeenLastCalledWith(null);
    reduced.matches = false;
    reduced.dispatchEvent(new Event("change"));
    expect(host.dataset.animating).toBe("true");
    if (typeof cleanup === "function") cleanup();
  });

  it("keeps the fallback on unavailable WebGL", () => {
    harness.fail = true;
    mount();
    expect(host.dataset.state).toBe("fallback");
  });

  it("shows the fallback on context loss and resumes after restoration", () => {
    const cleanup = mount();
    harness.renderer.domElement.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    expect(host.dataset.state).toBe("fallback");
    expect(host.dataset.animating).toBe("false");
    harness.renderer.domElement.dispatchEvent(new Event("webglcontextrestored"));
    expect(host.dataset.state).toBe("ready");
    expect(host.dataset.animating).toBe("true");
    if (typeof cleanup === "function") cleanup();
  });
});
