"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function ProjectCarousel({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setup = async () => {
      dispose?.();
      dispose = undefined;
      if (reduced.matches) return;
      try {
        const { createProjectCarousel } = await import("./project-carousel-runtime");
        if (!cancelled && !reduced.matches && host.current && !dispose) dispose = createProjectCarousel(host.current);
      } catch { /* The original scrolling cards remain usable if enhancement fails. */ }
    };
    void setup();
    reduced.addEventListener("change", setup);
    return () => { cancelled = true; reduced.removeEventListener("change", setup); dispose?.(); };
  }, []);

  return (
    <>
      <div ref={host} className="project-carousel mt-14" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Project Highlights" aria-describedby="project-carousel-help">
        <div className="project-carousel-list">{children}</div>
      </div>
      <p id="project-carousel-help" className="project-carousel-help">Swipe or drag to explore · Arrow keys to navigate · Space to pause</p>
    </>
  );
}
