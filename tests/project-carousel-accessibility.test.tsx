import { afterEach, describe, expect, it, vi } from "vitest";

const harness = vi.hoisted(() => ({ setup: undefined as undefined | (() => (() => void)) }));
vi.mock("react", async original => ({
  ...await original<typeof import("react")>(),
  useLayoutEffect: (setup: () => (() => void)) => { harness.setup = setup; },
}));

import { renderToStaticMarkup } from "react-dom/server";
import ProjectCarousel from "../src/components/home/ProjectCarousel";

afterEach(() => vi.unstubAllGlobals());

describe("carousel progressive enhancement", () => {
  it("renders every original link before JavaScript enhancement", () => {
    const html = renderToStaticMarkup(<ProjectCarousel><a href="/projects/first">First project</a><a href="/projects/second">Second project</a></ProjectCarousel>);
    expect(html).toContain('href="/projects/first"');
    expect(html).toContain('href="/projects/second"');
    expect(html).toContain('aria-roledescription="carousel"');
    expect(html).not.toContain('aria-hidden="true"');
    expect(html).not.toContain("<button");
  });

  it("leaves scrolling cards in place under reduced motion and removes its preference listener", () => {
    const preference = Object.assign(new EventTarget(), { matches: true });
    const remove = vi.spyOn(preference, "removeEventListener");
    vi.stubGlobal("window", { matchMedia: () => preference });
    renderToStaticMarkup(<ProjectCarousel>Original cards</ProjectCarousel>);
    const cleanup = harness.setup!();
    cleanup();
    expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
