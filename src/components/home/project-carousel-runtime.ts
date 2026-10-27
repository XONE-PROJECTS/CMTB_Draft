import { MathUtils, PerspectiveCamera, Scene } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { isSceneDrag } from "../site/construction-playback";

export function createProjectCarousel(host: HTMLDivElement) {
  if (typeof IntersectionObserver === "undefined" || typeof ResizeObserver === "undefined") return () => {};
  const list = host.querySelector<HTMLElement>(".project-carousel-list")!;
  const slides = Array.from(list.children) as HTMLElement[];
  const renderer = new CSS3DRenderer();
  renderer.domElement.className = "project-carousel-stage";
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 1, 4000);
  const objects = slides.map(slide => new CSS3DObject(slide));
  scene.add(...objects);
  let position = 0, target = 0, from = 0, travel = 0, last = 0, width = 420, spacing = 380;
  let frame = 0, timer: ReturnType<typeof setTimeout> | undefined;
  let focused = false, paused = false, visible = false, disposed = false;
  let drag: { id: number; x: number; y: number; moved: boolean } | undefined;
  let suppressClick = false;
  const index = () => MathUtils.euclideanModulo(Math.round(position), slides.length);

  function render() {
    const active = index();
    objects.forEach((object, i) => {
      const distance = MathUtils.euclideanModulo(i - position + slides.length / 2, slides.length) - slides.length / 2;
      object.position.set(distance * spacing, 0, -Math.abs(distance) * 120);
      object.rotation.y = -MathUtils.clamp(distance, -1, 1) * Math.PI * 35 / 180;
      object.visible = Math.abs(distance) < 2.6;
      object.element.style.opacity = String(1 - Math.min(Math.abs(distance), 1) * 0.25);
      object.element.setAttribute("aria-hidden", String(i !== active));
      object.element.querySelector("a")!.tabIndex = i === active ? 0 : -1;
    });
    host.dataset.active = String(active);
    renderer.render(scene, camera);
  }
  function available() { return visible && !document.hidden && !disposed; }
  function schedule() {
    clearTimeout(timer);
    host.dataset.paused = String(paused);
    if (available() && !paused && !focused && !drag && position === target) {
      timer = setTimeout(() => go(target + 1), 6000);
    }
  }
  function tick(time: number) {
    frame = 0;
    travel += last ? Math.min(time - last, 50) : 0;
    last = time;
    const progress = Math.min(travel / 700, 1);
    position = MathUtils.lerp(from, target, 1 - (1 - progress) ** 3);
    render();
    if (progress < 1 && available()) frame = requestAnimationFrame(tick);
    else schedule();
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (available() && position !== target) frame = requestAnimationFrame(tick);
    schedule();
  }
  function go(next: number) {
    from = position; target = next; travel = 0;
    sync();
  }
  function resize() {
    const containerWidth = host.clientWidth;
    if (!containerWidth) return;
    width = containerWidth >= 768 ? Math.min(480, containerWidth * 0.32) : containerWidth - 48;
    spacing = containerWidth >= 768 ? containerWidth * 0.235 : width * 0.86 + 24;
    slides.forEach(slide => { slide.style.width = `${width}px`; slide.style.height = "auto"; slide.style.display = ""; });
    const cardHeight = Math.max(...slides.map(slide => slide.offsetHeight));
    slides.forEach(slide => { slide.style.height = `${cardHeight}px`; });
    const height = cardHeight + 48;
    host.style.height = `${height}px`;
    renderer.setSize(containerWidth, height);
    camera.aspect = containerWidth / height;
    camera.position.z = height / (2 * Math.tan(MathUtils.degToRad(20)));
    camera.updateProjectionMatrix();
    render();
  }
  const onFocus = (event: FocusEvent) => {
    focused = (event.target as HTMLElement).matches(":focus-visible");
    // Stop on the currently readable card before a visitor follows its link.
    position = target = Math.round(position); travel = 0;
    cancelAnimationFrame(frame); frame = 0;
    render(); schedule();
  };
  const onBlur = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) return;
    focused = false; schedule();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      host.focus({ preventScroll: true });
      focused = true;
      go(target + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === " ") { event.preventDefault(); paused = !paused; schedule(); }
  };
  const down = (event: PointerEvent) => {
    if (event.button !== 0) return;
    focused = false;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    drag.moved ||= isSceneDrag(drag.x, drag.y, event.clientX, event.clientY);
    if (drag.moved && Math.abs(event.clientX - drag.x) > Math.abs(event.clientY - drag.y)) host.setPointerCapture?.(event.pointerId);
  };
  const release = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    suppressClick = drag.moved || isSceneDrag(drag.x, drag.y, event.clientX, event.clientY);
    drag = undefined;
    if (host.hasPointerCapture?.(event.pointerId)) host.releasePointerCapture(event.pointerId);
    if (suppressClick && Math.abs(dx) > Math.abs(dy)) go(target + (dx < 0 ? 1 : -1));
    else schedule();
  };
  const cancel = () => { suppressClick = true; drag = undefined; schedule(); };
  const click = (event: MouseEvent) => { if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); } };
  const preventDrag = (event: Event) => event.preventDefault();
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  const resizeObserver = new ResizeObserver(resize);
  const listeners: [string, EventListener, boolean?][] = [
    ["focusin", onFocus], ["focusout", onBlur],
    ["keydown", onKey], ["pointerdown", down], ["pointermove", move], ["pointerup", release],
    ["pointercancel", cancel], ["click", click, true], ["dragstart", preventDrag], ["load", resize, true],
  ];
  const dispose = () => {
    if (disposed) return;
    disposed = true; clearTimeout(timer); cancelAnimationFrame(frame);
    observer.disconnect(); resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", sync);
    listeners.forEach(([name, callback, capture]) => host.removeEventListener(name, callback, capture));
    scene.clear();
    slides.forEach(slide => {
      slide.removeAttribute("style"); slide.removeAttribute("aria-hidden");
      slide.querySelector("a")!.removeAttribute("tabindex");
      list.appendChild(slide);
    });
    renderer.domElement.remove(); host.style.removeProperty("height");
    delete host.dataset.enhanced; delete host.dataset.active; delete host.dataset.paused;
  };
  try {
    host.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    host.dataset.enhanced = "true";
    resize();
    listeners.forEach(([name, callback, capture]) => host.addEventListener(name, callback, capture));
    document.addEventListener("visibilitychange", sync);
    observer.observe(host); resizeObserver.observe(host);
    document.fonts?.ready.then(() => { if (!disposed) resize(); });
    return dispose;
  } catch { dispose(); return () => {}; }
}
