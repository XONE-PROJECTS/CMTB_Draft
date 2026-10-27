"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export default function SiteMotion() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyPath = useRef<string | null>(null);

  useEffect(() => {
    const scope = document.querySelector<HTMLElement>(".public-site");
    if (!scope) return;
    const header = scope.querySelector("header");
    const measureHeader = () => scope.style.setProperty("--site-header-height", `${header?.getBoundingClientRect().height ?? 0}px`);
    const headerObserver = new ResizeObserver(measureHeader);
    if (header) headerObserver.observe(header);
    measureHeader();
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();
    let lenis: Lenis | undefined;
    let anchorFrame = 0;
    const tick = (time: number) => lenis?.raf(time * 1000);

    media.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      lenis = new Lenis({
        autoRaf: false, lerp: 0.12, syncTouch: false, anchors: false,
        prevent: (node) => node.closest("[data-mobile-menu], [role=dialog]") !== null,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = undefined;
      };
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      const context = gsap.context(() => {
        scope.querySelectorAll<HTMLElement>("[data-split]").forEach((heading) => {
          if (heading.closest("[data-reveal]")) return;
          const split = SplitText.create(heading, {
            type: "lines", autoSplit: true, aria: "auto",
            onSplit(self) {
              if (!self.lines.length) return;
              return gsap.from(self.lines, {
                yPercent: 55, opacity: 0, duration: 0.8, stagger: 0.075,
                ease: "power3.out",
                scrollTrigger: { trigger: heading, start: "top 95%", once: true },
              });
            },
          });
          splits.push(split);
        });
        const intro = scope.querySelectorAll("[data-hero-intro]");
        if (intro.length) {
          gsap.from(intro, {
            y: 14, opacity: 0, duration: 0.85, stagger: 0.09, ease: "power3.out",
          });
        }
        scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((photo) => {
          gsap.fromTo(photo, { yPercent: -3 }, {
            yPercent: 3, ease: "none",
            scrollTrigger: { trigger: photo.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }, scope);
      return () => {
        context.revert();
        splits.forEach((split) => split.revert());
      };
    });

    function scrollToHash(instant = false) {
      if (!window.location.hash) return;
      let id = window.location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep malformed fragments literal. */ }
      const target = document.getElementById(id);
      if (!target) return;
      const header = scope.querySelector("header")?.getBoundingClientRect().height ?? 0;
      const serviceNav = scope.querySelector("[data-service-nav]")?.getBoundingClientRect().height ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - header - serviceNav - 20;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (lenis) lenis.scrollTo(top, { immediate: instant || reduced });
      else window.scrollTo({ top, behavior: instant || reduced ? "instant" : "smooth" });
    }

    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      scrollToHash();
    };
    // Next and the browser own history restoration, including fragment entries.
    const onHistory = () => {
      historyPath.current = window.location.pathname;
      anchorFrame = window.requestAnimationFrame(() => lenis?.resize());
    };
    const onHash = (event: HashChangeEvent) => {
      if (new URL(event.newURL).pathname === new URL(event.oldURL).pathname) scrollToHash(true);
    };
    const refresh = () => ScrollTrigger.refresh();
    scope.addEventListener("click", onAnchor, true);
    scope.addEventListener("load", refresh, true);
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHash);
    anchorFrame = window.requestAnimationFrame(() => {
      if (window.location.hash) scrollToHash(true);
      else if (previousPath.current !== pathname && historyPath.current !== pathname) {
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo({ top: 0, behavior: "instant" });
      }
      previousPath.current = pathname;
      historyPath.current = null;
      refresh();
    });

    return () => {
      headerObserver.disconnect();
      window.cancelAnimationFrame(anchorFrame);
      scope.removeEventListener("click", onAnchor, true);
      scope.removeEventListener("load", refresh, true);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("hashchange", onHash);
      media.revert();
    };
  }, [pathname]);

  return null;
}
