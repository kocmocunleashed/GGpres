import assert from "node:assert/strict";
import { test } from "node:test";
import { Box3, Mesh, Vector3 } from "three";
import { buildSceneObject, disposeSceneObject } from "../components/lesson/scene3d/SceneObjects";
import { LESSON_SCENES } from "./lesson-scenes";
import { layoutLessonScene, sceneRelationPath } from "./lesson-scene-layout";
import { layoutSceneInk, paintSceneInk } from "./lesson-scene-ink";
import type { SceneKind, SceneNode } from "./lesson-scene";

test("literal ink retains all four directory entries and draws every logical line", () => {
  const names = ["lesson-outline.md", "lesson-outline.mn.md", "notes.mn.txt", "notes.txt"];
  const rendered: string[] = [];
  const context = {
    font: "",
    measureText(text: string) { return { width: text.length * Number(this.font.split(" ")[1].replace("px", "")) * .6 }; },
    fillText(text: string) { rendered.push(text); },
  };
  const layout = paintSceneInk(context, names.join("\n"));
  assert.deepEqual(layout.lines.map(line => line.text), names);
  assert.deepEqual(rendered, names);
  for (const line of layout.lines) {
    assert.ok(context.measureText(line.text).width <= 334);
    assert.ok(line.y + layout.fontSize * .25 <= 263);
  }
});

test("fitting ink preserves paths, separators, indentation and more than four lines", () => {
  const lines = ["ls /home/student/Documents", "lesson-outline.md", "lesson-outline.mn.md", "notes.mn.txt", "notes.txt", "  /exact/path · literal  "];
  const layout = layoutSceneInk(lines.join("\n"), (line, fontSize) => line.length * fontSize * .6);
  assert.deepEqual(layout.lines.map(line => line.text), lines);
  assert.ok(layout.lines.at(-1)!.y + layout.fontSize * .25 <= 263);
});

test("every actual rotated model is centred and has finite framing bounds", () => {
  const kinds: SceneKind[] = ["app", "process", "computer", "cpu", "cpu-core", "ram", "storage", "image-file", "text-file", "software", "desktop", "terminal", "code", "person", "server", "contacts", "shield", "key", "package", "folder"];
  for (const kind of kinds) for (const content of [undefined, "drawing"] as const) {
    const asset = buildSceneObject({ id: kind, kind, label: [kind, kind], content }, "en");
    const bounds = new Box3().setFromObject(asset.object);
    assert.ok(bounds.getCenter(new Vector3()).length() < 1e-6, kind);
    assert.ok(Number.isFinite(asset.width) && asset.width > 0, kind);
    assert.ok(Number.isFinite(asset.height) && asset.height > 0, kind);
    assert.ok(Math.abs(bounds.max.x - bounds.min.x - asset.width) < 1e-6, kind);
    assert.ok(Math.abs(bounds.max.y - bounds.min.y - asset.height) < 1e-6, kind);
    disposeSceneObject(asset);
  }
});

test("every lesson state fits its actual mesh bounds and reserved labels at classroom and mobile sizes", () => {
  for (const scene of LESSON_SCENES) for (const state of scene.states) {
    const assets = state.nodes.map(node => buildSceneObject(node, "en"));
    for (const [width, height] of [[700, 340], [350, 320], [280, 320]]) {
      const items = state.nodes.map((node, index) => ({ id: node.id, extent: assets[index], labelHeight: state.nodes.length === 4 ? 68 : 110 }));
      const cells = layoutLessonScene(width, height, items, !!state.container);
      for (const cell of cells) {
        const context = `${scene.chapter}/${state.id}/${cell.id} at ${width}`;
        assert.ok(cell.centerX - cell.objectWidth / 2 >= 0, `${context} left`);
        assert.ok(cell.centerX + cell.objectWidth / 2 <= width, `${context} right`);
        assert.ok(cell.centerY - cell.objectHeight / 2 >= 0, `${context} top`);
        assert.ok(cell.centerY + cell.objectHeight / 2 < cell.labelTop, `${context} object overlaps label`);
        assert.ok(cell.labelTop + cell.labelHeight <= height, `${context} label clipped`);
        assert.ok(cell.labelLeft >= 0 && cell.labelLeft + cell.labelWidth <= width, `${context} label width`);
      }
      if (state.nodes.length === 4 && width < 520) assert.equal(new Set(cells.map(cell => cell.row)).size, 2);
    }
    assets.forEach(disposeSceneObject);
  }
});

test("a relation to a nonadjacent node goes above the intervening object", () => {
  const cells = layoutLessonScene(350, 320, [
    { id: "drawing", extent: { width: 1.72, height: 1.35 } },
    { id: "waiting-music", extent: { width: 1.72, height: 1.35 } },
    { id: "core", extent: { width: 1.7, height: .8 } },
  ]);
  const path = sceneRelationPath(cells[0], cells[2], cells);
  const points = Array.from(path.matchAll(/[ML]\s+([\d.-]+)\s+([\d.-]+)/g), match => [Number(match[1]), Number(match[2])]);
  assert.equal(points.length, 4);
  const middle = cells[1];
  assert.ok(points[1][1] < middle.centerY - middle.objectHeight / 2);
  assert.equal(points[1][1], points[2][1]);
  assert.ok(points[0][0] < middle.centerX - middle.objectWidth / 2);
  assert.ok(points[3][0] > middle.centerX + middle.objectWidth / 2);
});

test("empty RAM and server have no invented contents; copied contents have their own face", () => {
  for (const kind of ["ram", "server"] as const) for (const content of [undefined, "drawing"] as const) {
    const asset = buildSceneObject({ id: kind, kind, label: [kind, kind], content }, "en");
    let drawings = 0;
    asset.object.traverse(object => { if (object.userData.content === "drawing" && object instanceof Mesh) drawings++; });
    assert.equal(drawings, content ? 1 : 0, `${kind}/${content ?? "empty"}`);
    disposeSceneObject(asset);
  }
});

test("changed source and text results use the current state payload", () => {
  const nodes: SceneNode[] = [
    { id: "source", kind: "code", label: ["Code", "Code"], content: "code", ink: ['write("cat")', 'write("cat")'], detail: ["An instruction", "Нэг заавар"] },
    { id: "result", kind: "app", label: ["Result", "Үр дүн"], content: "text", ink: ["cat", "cat"], detail: ["A word", "Нэг үг"] },
  ];
  for (const node of nodes) {
    const asset = buildSceneObject(node, "en");
    const payloads: string[] = [];
    asset.object.traverse(object => { if (object instanceof Mesh && object.userData.ink) payloads.push(object.userData.ink); });
    assert.deepEqual(payloads, [node.ink![0]]);
    disposeSceneObject(asset);
  }
});

test("descriptions are not printed as contents, and nested copies retain explicit ink", () => {
  const description = "These words describe the object rather than its saved contents.";
  for (const kind of ["text-file", "code", "server", "folder", "ram"] as const) {
    for (const ink of [undefined, "/exact/path · literal"] as const) {
      const asset = buildSceneObject({ id: kind, kind, label: [kind, kind], content: "text", detail: [description, description], ink: ink ? [ink, ink] : undefined }, "en");
      const payloads: string[] = [];
      asset.object.traverse(object => { if (object instanceof Mesh && object.userData.ink) payloads.push(object.userData.ink); });
      assert.deepEqual(payloads, ink ? [ink] : [], kind);
      disposeSceneObject(asset);
    }
  }
});

test("the software desktop has windows and a dock; only hardware has a monitor stand", () => {
  const desktop = buildSceneObject({ id: "gnome", kind: "desktop", label: ["GNOME", "GNOME"] }, "en");
  const computer = buildSceneObject({ id: "computer", kind: "computer", label: ["Computer", "Компьютер"] }, "en");
  assert.ok(desktop.object.getObjectByName("workspace-dock"));
  assert.equal(desktop.object.getObjectByName("computer-stand"), undefined);
  assert.ok(computer.object.getObjectByName("computer-stand"));
  assert.equal(computer.object.getObjectByName("workspace-dock"), undefined);
  disposeSceneObject(desktop);
  disposeSceneObject(computer);
});

test("unmounted models release every owned geometry and material", () => {
  const asset = buildSceneObject({ id: "server", kind: "server", label: ["Server", "Server"], content: "drawing" }, "en");
  let geometries = 0, materials = 0, disposedGeometries = 0, disposedMaterials = 0;
  asset.object.traverse(object => {
    if (!(object instanceof Mesh)) return;
    geometries++;
    object.geometry.addEventListener("dispose", () => disposedGeometries++);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials++;
      material.addEventListener("dispose", () => disposedMaterials++);
    }
  });
  disposeSceneObject(asset);
  assert.equal(disposedGeometries, geometries);
  assert.equal(disposedMaterials, materials);
});
