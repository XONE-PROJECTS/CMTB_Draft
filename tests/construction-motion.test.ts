import { describe, expect, it } from "vitest";
import { Box3, Object3D, Quaternion, Vector3, Mesh, Material } from "three";
import { createConstructionModel, type SceneVariant } from "../src/components/site/construction-model";
import { buildingPlayback, stagePoses, isSceneDrag } from "../src/components/site/construction-playback";

const position = (object: Object3D) => object.getWorldPosition(new Vector3());
const axis = (object: Object3D) => new Vector3(0, 1, 0).applyQuaternion(object.getWorldQuaternion(new Quaternion()));

describe("building sequence", () => {
  it("plays the four stages over sixteen seconds and loops without a discontinuity", () => {
    expect(buildingPlayback(0)).toEqual({ ...stagePoses.assembled, stage: "assembled" });
    expect(buildingPlayback(4)).toEqual({ ...stagePoses.wireframe, stage: "wireframe" });
    expect(buildingPlayback(9)).toEqual({ ...stagePoses.exploded, stage: "exploded" });
    expect(buildingPlayback(14)).toEqual({ ...stagePoses.reassembled, stage: "reassembled" });
    expect(buildingPlayback(16)).toEqual(buildingPlayback(0));
    expect(buildingPlayback(3).wireframe).toBeCloseTo(0.5);
    expect(buildingPlayback(7.5).explosion).toBeCloseTo(0.5);
    expect(buildingPlayback(12.5).explosion).toBeCloseTo(0.5);
  });

  it("returns storeys and roof exactly to rest and isolates transition materials", () => {
    const model = createConstructionModel("home");
    const building = model.root.getObjectByName("building")!;
    const roof = building.getObjectByName("building-roof")!;
    const rest = building.children.map(object => object.position.toArray());
    const roofHeight = roof.position.y;
    let craneMaterial: Material | undefined;
    model.root.getObjectByName("tower-crane")!.traverse(object => {
      if (!craneMaterial && object instanceof Mesh) craneMaterial = object.material as Material;
    });
    for (let cycle = 0; cycle < 20; cycle++) {
      model.update(cycle, 0, stagePoses.exploded);
      expect(roof.position.y).toBeGreaterThan(roofHeight);
      expect(craneMaterial!.opacity).toBe(1);
      model.update(cycle, 0, stagePoses.reassembled);
      expect(building.children.map(object => object.position.toArray())).toEqual(rest);
    }
    model.dispose();
  });
});

describe("mechanical rigs", () => {
  it("cycles machinery actions automatically without a click", () => {
    const model = createConstructionModel("equipment");
    model.update(0);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeCloseTo(0);
    model.update(6.5);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeLessThan(-0.5);
    expect(model.root.getObjectByName("excavator-boom")!.rotation.z).toBeLessThan(0.9);
    model.update(10);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeCloseTo(0);
    model.update(16.5);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeLessThan(-0.5);
    model.dispose();
  });
  it("spins mixer markings around a fixed longitudinal axle without moving its chassis or chute", () => {
    const model = createConstructionModel("equipment");
    const drum = model.root.getObjectByName("mixer-drum")!;
    const marking = model.root.getObjectByName("mixer-marking")!;
    const chassis = model.root.getObjectByName("mixer-chassis")!;
    const wheels = model.root.getObjectByName("mixer-wheels")!;
    const chute = model.root.getObjectByName("mixer-chute")!;
    model.update(0); model.root.updateMatrixWorld(true);
    const fixedAxis = axis(drum), centre = position(drum), initialMark = position(marking);
    const fixed = [chassis, wheels, chute].map(object => object.matrixWorld.toArray());
    const radius = initialMark.clone().sub(centre).length();
    model.triggerAction("mixer");
    for (const time of [0.1, 0.5, 1, 1.5, 2, 3, 4]) {
      model.update(time); model.root.updateMatrixWorld(true);
      expect(axis(drum).distanceTo(fixedAxis)).toBeLessThan(1e-10);
      expect(position(drum).distanceTo(centre)).toBeLessThan(1e-10);
      expect(position(marking).sub(centre).length()).toBeCloseTo(radius, 10);
      expect([chassis, wheels, chute].map(object => object.matrixWorld.toArray())).toEqual(fixed);
    }
    expect(position(marking).distanceTo(initialMark)).toBeGreaterThan(0.05);
    model.dispose();
  });

  it("keeps the home cable and slab outside the fully exploded building", () => {
    const model = createConstructionModel("home");
    const building = model.root.getObjectByName("building")!;
    const load = model.root.getObjectByName("tower-crane-load")!;
    const cable = model.root.getObjectByName("tower-crane-cable")!;
    model.triggerAction("crane");
    for (let time = 0; time <= 30; time += 0.25) {
      model.update(time, 0, stagePoses.exploded); model.root.updateMatrixWorld(true);
      const buildingBounds = new Box3().setFromObject(building);
      const loadBounds = new Box3().setFromObject(load);
      const cableBounds = new Box3().setFromObject(cable);
      expect(loadBounds.min.z).toBeGreaterThan(buildingBounds.max.z + 0.1);
      expect(cableBounds.intersectsBox(buildingBounds)).toBe(false);
      expect(axis(cable).distanceTo(new Vector3(0, 1, 0))).toBeLessThan(1e-10);
    }
    model.dispose();
  });

  it("keeps excavator hinges connected, tips from the rear hinge and suspends crane loads vertically", () => {
    const model = createConstructionModel("equipment");
    model.update(0);
    for (const action of ["excavator", "dump-truck", "mobile-crane"]) model.triggerAction(action);
    const boom = model.root.getObjectByName("excavator-boom")!;
    const stick = model.root.getObjectByName("excavator-stick")!;
    const bucket = model.root.getObjectByName("excavator-bucket")!;
    const bed = model.root.getObjectByName("dump-bed")!;
    const hinge = position(bed);
    for (let time = 0; time <= 3; time += 0.1) {
      model.update(time); model.root.updateMatrixWorld(true);
      expect(boom.localToWorld(new Vector3(2, 0, 0)).distanceTo(position(stick))).toBeLessThan(1e-10);
      expect(stick.localToWorld(new Vector3(1.6, 0, 0)).distanceTo(position(bucket))).toBeLessThan(1e-10);
      expect(new Box3().setFromObject(bucket).min.y).toBeGreaterThan(0.14);
      expect(position(bed).distanceTo(hinge)).toBeLessThan(1e-10);
      const tip = position(model.root.getObjectByName("mobile-crane-tip")!);
      const load = position(model.root.getObjectByName("mobile-crane-load")!);
      expect(tip.x).toBeCloseTo(load.x, 10);
      expect(tip.z).toBeCloseTo(load.z, 10);
      expect(tip.y).toBeGreaterThan(load.y);
    }
    model.update(3.1);
    expect(bed.rotation.z).toBeCloseTo(0, 10);
    model.dispose();
  });

  it("restarts one fleet action without changing another rig's resting pose", () => {
    const model = createConstructionModel("equipment");
    model.update(0);
    model.triggerAction("dump-truck"); model.update(1.5);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeLessThan(-0.5);
    expect(model.root.getObjectByName("excavator-boom")!.rotation.z).toBeCloseTo(1.1);
    model.triggerAction("dump-truck"); model.update(1.5);
    expect(model.root.getObjectByName("dump-bed")!.rotation.z).toBeCloseTo(0);
    model.dispose();
  });
});

describe("site workers", () => {
  it.each(["home", "about", "services", "equipment", "projects", "detail"] as SceneVariant[])("walks on the %s surface and stops to wave", variant => {
    const model = createConstructionModel(variant);
    const worker = model.root.getObjectByName("worker-1")!;
    model.update(0); model.root.updateMatrixWorld(true);
    const start = position(worker);
    for (let time = 0; time <= 4; time += 0.1) {
      model.update(time); model.root.updateMatrixWorld(true);
      expect(worker.position.y).toBe(worker.userData.ground);
      worker.traverse(object => {
        if (object.name.endsWith("-boot")) expect(new Box3().setFromObject(object).min.y).toBeCloseTo(worker.userData.ground, 6);
      });
    }
    expect(position(worker).distanceTo(start)).toBeGreaterThan(0.01);
    const stopped = worker.position.clone();
    model.triggerAction("worker-1"); model.update(4.5);
    expect(worker.position.distanceTo(stopped)).toBeLessThan(1e-10);
    model.update(6); expect(worker.position.distanceTo(stopped)).toBeLessThan(1e-10);
    model.update(6.5); expect(worker.position.distanceTo(stopped)).toBeLessThan(0.4);
    model.dispose();
  });
});

describe("gesture classification", () => {
  it("accepts a small click movement and rejects horizontal or vertical drags", () => {
    expect(isSceneDrag(0, 0, 3, 3)).toBe(false);
    expect(isSceneDrag(0, 0, 7, 0)).toBe(true);
    expect(isSceneDrag(0, 0, 0, 7)).toBe(true);
  });
});
