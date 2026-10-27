import { afterEach, describe, expect, it, vi } from "vitest";
import { createTechnicalDrawing, drawTechnicalPlan } from "../src/components/site/construction-drawings";
import { createSceneParts } from "../src/components/site/construction-parts";
import { Group, Mesh, MeshBasicMaterial } from "three";

function drawingContext() {
  const methods = ["fillRect", "strokeRect", "beginPath", "moveTo", "lineTo", "stroke", "fillText", "save", "translate", "rotate", "arc", "restore", "ellipse", "setLineDash", "bezierCurveTo", "closePath", "fill"];
  return Object.fromEntries(methods.map(method => [method, vi.fn()])) as unknown as CanvasRenderingContext2D;
}

afterEach(() => vi.unstubAllGlobals());

describe("architectural drawing sheets", () => {
  it("draws a blue architectural plan with rooms, door swings, dimensions and sheet identification", () => {
    const context = drawingContext();
    drawTechnicalPlan(context, "blueprint");
    const text = vi.mocked(context.fillText).mock.calls.map(call => call[0]);
    expect(text).toContain("GROUND FLOOR PLAN");
    expect(text).toContain("18 000");
    expect(text).toContain("STAIR");
    expect(text).toContain("A-101");
    const doorSwings = vi.mocked(context.arc).mock.calls.filter(call => call[2] >= 65);
    expect(doorSwings).toHaveLength(6);
    expect(doorSwings.every(call => call[3] === -Math.PI / 2 && call[4] === 0)).toBe(true);
    expect(context.strokeRect).toHaveBeenCalled();
    expect(context.lineTo).toHaveBeenCalled();
  });

  it("draws a distinct site plan with roads, numbered plots, planting and land-use legend", () => {
    const context = drawingContext();
    drawTechnicalPlan(context, "masterplan");
    const text = vi.mocked(context.fillText).mock.calls.map(call => call[0]);
    for (const label of ["CONCEPTUAL SITE LAYOUT", "CENTRAL GREEN", "LAND USE", "ACCESS ROAD", "MP-01", "01", "12"]) expect(text).toContain(label);
    expect(context.bezierCurveTo).toHaveBeenCalledTimes(6);
    expect(context.arc).toHaveBeenCalledTimes(25);
    expect(context.fill).toHaveBeenCalledTimes(26);
  });

  it("owns and disposes the generated drawing texture", () => {
    const context = drawingContext();
    vi.stubGlobal("document", { createElement: () => ({ width: 0, height: 0, getContext: () => context }) });
    const parts = createSceneParts(new Group());
    const drawing = createTechnicalDrawing(parts, "blueprint");
    const sheet = drawing.board.getObjectByName("blueprint-sheet") as Mesh;
    const texture = (sheet.material as MeshBasicMaterial).map!;
    expect(texture.image.width).toBe(1600);
    expect(texture.image.height).toBe(1100);
    const dispose = vi.spyOn(texture, "dispose");
    drawing.dispose();
    expect(dispose).toHaveBeenCalledOnce();
    parts.geometries.forEach(resource => resource.dispose());
    parts.resources.forEach(resource => resource.dispose());
  });
});
