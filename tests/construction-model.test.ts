import { describe, expect, it, vi } from "vitest";
import { Box3, BufferGeometry, Material } from "three";
import { createConstructionModel, type SceneVariant } from "../src/components/site/construction-model";

const variants: SceneVariant[] = ["home", "about", "services", "equipment", "projects", "detail", "compliance", "contact"];

describe("procedural construction scenes", () => {
  it("gives every page a different silhouette and geometry layout", () => {
    const silhouettes = variants.map((variant) => {
      const model = createConstructionModel(variant);
      model.update(0);
      const parts: unknown[] = [];
      model.root.traverse((object) => {
        if ("geometry" in object) parts.push([(object.geometry as BufferGeometry).type, object.position.toArray(), object.scale.toArray()]);
      });
      const bounds = new Box3().setFromObject(model.root);
      if (variant === "about") expect(bounds.max.y).toBeLessThan(1);
      if (variant === "detail") expect((bounds.max.x - bounds.min.x) / (bounds.max.y - bounds.min.y)).toBeGreaterThan(2);
      model.dispose();
      return JSON.stringify(parts);
    });
    expect(new Set(silhouettes).size).toBe(variants.length);
  });

  it.each(variants)("builds and animates finite geometry for %s", (variant) => {
    const model = createConstructionModel(variant);
    for (const time of [0, 1, 30, 600]) {
      model.update(time, 0.5);
      model.root.updateMatrixWorld(true);
      const bounds = new Box3().setFromObject(model.root);
      expect(bounds.isEmpty()).toBe(false);
      expect([...bounds.min.toArray(), ...bounds.max.toArray()].every(Number.isFinite)).toBe(true);
      expect(bounds.max.y).toBeLessThan(9);
      model.root.traverse((object) => expect(object.matrixWorld.elements.every(Number.isFinite)).toBe(true));
    }
    model.dispose();
  });

  it.each(variants)("disposes each shared GPU resource exactly once for %s", (variant) => {
    const model = createConstructionModel(variant);
    const resources = new Set<BufferGeometry | Material>();
    model.root.traverse((object) => {
      if ("geometry" in object) resources.add(object.geometry as BufferGeometry);
      if ("material" in object) {
        const material = object.material as Material | Material[];
        (Array.isArray(material) ? material : [material]).forEach((item) => resources.add(item));
      }
    });
    const spies = [...resources].map((resource) => vi.spyOn(resource, "dispose"));
    model.dispose();
    model.dispose();
    expect(model.root.children).toHaveLength(0);
    spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
    vi.restoreAllMocks();
  });
});
