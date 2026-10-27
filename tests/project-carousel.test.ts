import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createProjectCarousel } from "../src/components/home/project-carousel-runtime";

class ElementStub extends EventTarget {
  style: Record<string, any> = { removeProperty: (name: string) => delete this.style[name] };
  dataset: Record<string, string> = {};
  attributes = new Map<string, string>();
  children: ElementStub[] = [];
  parentNode: ElementStub | null = null;
  ownerDocument: any;
  clientWidth = 1100;
  offsetHeight = 460;
  tabIndex = 0;
  constructor(public kind = "div") { super(); this.ownerDocument = document; }
  appendChild(child: ElementStub) { child.remove(); child.parentNode = this; this.children.push(child); return child; }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(child => child !== this); this.parentNode = null; }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  removeAttribute(name: string) { this.attributes.delete(name); if (name === "tabindex") this.tabIndex = 0; }
  querySelector(selector: string): ElementStub | null {
    return this.children.find(child => selector === "a" ? child.kind === "a" : child.kind === "list") ?? null;
  }
  contains(node: ElementStub): boolean { return node === this || this.children.some(child => child.contains(node)); }
  focus() { this.dispatchEvent(new Event("focusin")); }
  matches() { return true; }
}

describe("project highlights carousel", () => {
  let host: ElementStub, list: ElementStub, slides: ElementStub[], page: EventTarget & { hidden: boolean };
  let intersection: (entries: { isIntersecting: boolean }[]) => void;
  let dispose: () => void;
  let disconnect: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.useFakeTimers();
    page = Object.assign(new EventTarget(), { hidden: false, createElement: () => new ElementStub(), defaultView: { Element: ElementStub } });
    vi.stubGlobal("document", page); vi.stubGlobal("Node", ElementStub);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16));
    vi.stubGlobal("cancelAnimationFrame", clearTimeout);
    disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: typeof intersection) { intersection = callback; }
      observe = vi.fn(); disconnect = disconnect;
    });
    vi.stubGlobal("ResizeObserver", class { observe = vi.fn(); disconnect = disconnect; });
    host = new ElementStub(); list = new ElementStub("list"); host.appendChild(list);
    slides = Array.from({ length: 6 }, () => { const slide = new ElementStub(); slide.appendChild(new ElementStub("a")); list.appendChild(slide); return slide; });
    dispose = createProjectCarousel(host as unknown as HTMLDivElement);
    intersection([{ isIntersecting: true }]);
  });
  afterEach(() => { dispose(); vi.useRealTimers(); vi.unstubAllGlobals(); });
  const key = (value: string) => host.dispatchEvent(Object.assign(new Event("keydown", { cancelable: true }), { key: value }));
  function pointer(type: string, x: number, y = 0) {
    host.dispatchEvent(Object.assign(new Event(type), { pointerId: 1, button: 0, clientX: x, clientY: y }));
  }

  it("advances automatically, wraps in both directions and exposes one keyboard link", () => {
    expect(slides.filter(slide => slide.style.display !== "none")).toHaveLength(5);
    vi.advanceTimersByTime(6800); expect(host.dataset.active).toBe("1");
    key("ArrowLeft"); vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("0");
    key("ArrowLeft"); vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("5");
    key("ArrowRight"); vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("0");
    expect(slides.filter(slide => slide.querySelector("a")!.tabIndex === 0)).toHaveLength(1);
  });

  it("pauses for keyboard focus and starts a fresh six-second timer afterwards", () => {
    host.dispatchEvent(new Event("focusin")); vi.advanceTimersByTime(14000); expect(host.dataset.active).toBe("0");
    host.dispatchEvent(Object.assign(new Event("focusout"), { relatedTarget: null }));
    vi.advanceTimersByTime(5900); expect(host.dataset.active).toBe("0");
    vi.advanceTimersByTime(1000); expect(host.dataset.active).toBe("1");
  });

  it("keeps autoplay running on hover and resumes after a mouse drag", () => {
    host.dispatchEvent(new Event("pointerenter")); vi.advanceTimersByTime(6800); expect(host.dataset.active).toBe("1");
    pointer("pointerdown", 100); pointer("pointermove", 40); pointer("pointerup", 40);
    vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("2");
    vi.advanceTimersByTime(6800); expect(host.dataset.active).toBe("3");
  });

  it("retains explicit pause through hover changes", () => {
    key(" "); host.dispatchEvent(new Event("pointerleave")); vi.advanceTimersByTime(15000);
    expect(host.dataset.active).toBe("0"); expect(host.dataset.paused).toBe("true");
    key(" "); vi.advanceTimersByTime(6800); expect(host.dataset.active).toBe("1");
  });

  it("suspends timers offscreen and in background tabs", () => {
    intersection([{ isIntersecting: false }]); vi.advanceTimersByTime(12000); expect(host.dataset.active).toBe("0");
    intersection([{ isIntersecting: true }]); page.hidden = true; page.dispatchEvent(new Event("visibilitychange"));
    vi.advanceTimersByTime(12000); expect(host.dataset.active).toBe("0");
    page.hidden = false; page.dispatchEvent(new Event("visibilitychange")); vi.advanceTimersByTime(6800); expect(host.dataset.active).toBe("1");
  });

  it("distinguishes links, horizontal swipes, and vertical page scrolling", () => {
    pointer("pointerdown", 100); pointer("pointerup", 95);
    const click = () => Object.assign(new Event("click", { cancelable: true }), { detail: 1 });
    expect(host.dispatchEvent(click())).toBe(true);
    pointer("pointerdown", 100); pointer("pointermove", 40); pointer("pointerup", 40);
    expect(host.dispatchEvent(click())).toBe(false); vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("1");
    pointer("pointerdown", 100); pointer("pointermove", 102, 70); pointer("pointerup", 102, 70);
    vi.advanceTimersByTime(800); expect(host.dataset.active).toBe("1");
  });

  it("restores the same cards and removes callbacks and DOM wrappers on repeated cleanup", () => {
    dispose(); dispose();
    expect(list.children).toEqual(slides);
    expect(host.children).toEqual([list]); expect(host.dataset.enhanced).toBeUndefined();
    expect(disconnect).toHaveBeenCalledTimes(2); expect(vi.getTimerCount()).toBe(0);
    slides.forEach(slide => expect(slide.attributes.has("aria-hidden")).toBe(false));
  });
});
