"use client";

import { Box3, BoxGeometry, BufferGeometry, CanvasTexture, CylinderGeometry, ExtrudeGeometry, Group, LinearFilter, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, Shape, ShapeGeometry, SphereGeometry, SRGBColorSpace, TorusGeometry, Vector3, type Material } from "three";
import { sceneWords, type SceneContent, type SceneLanguage, type SceneNode } from "@/lib/lesson-scene";
import { paintSceneInk } from "@/lib/lesson-scene-ink";

const BLUE = "#2354f4";
const PAPER = "#f2f1e8";
const INK = "#171919";
const PALE = "#cbd8f7";
const MUTED = "#939b96";
const AMBER = "#966024";
type Position = [number, number, number];

export interface SceneObjectAsset {
  object: Group;
  width: number;
  height: number;
}

function addMesh(parent: Group, geometry: BufferGeometry, color: string, at: Position, material?: Material) {
  const mesh = new Mesh(geometry, material ?? new MeshStandardMaterial({ color, roughness: .74, metalness: .04 }));
  mesh.position.set(...at);
  parent.add(mesh);
  return mesh;
}

function box(parent: Group, size: Position, at: Position, color = PAPER) {
  return addMesh(parent, new BoxGeometry(...size), color, at);
}

function line(parent: Group, from: Position, to: Position, thickness: number, color = BLUE) {
  const a = new Vector3(...from), b = new Vector3(...to);
  const mesh = addMesh(parent, new CylinderGeometry(thickness, thickness, a.distanceTo(b), 8), color, a.clone().lerp(b, .5).toArray() as Position);
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), b.sub(a).normalize());
  return mesh;
}

/** Screen/file ink is local canvas artwork; it never loads a font or an image. */
function contentTexture(content: SceneContent, language: SceneLanguage, width: number, height: number, ink?: string) {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 384; canvas.height = Math.round(384 * height / width);
  const c = canvas.getContext("2d");
  if (!c) return undefined;
  c.fillStyle = content === "code" || content === "music" ? INK : PAPER;
  c.fillRect(0, 0, canvas.width, canvas.height);
  // Preserve the drawing and glyph proportions on both wide screens and tall
  // documents. Resizing the backing paper must never stretch the cat itself.
  const scale = Math.min(canvas.width / 384, canvas.height / 288);
  c.translate((canvas.width - 384 * scale) / 2, (canvas.height - 288 * scale) / 2);
  c.scale(scale, scale);
  c.strokeStyle = BLUE; c.fillStyle = BLUE; c.lineWidth = 10;
  c.lineJoin = "round"; c.lineCap = "round";
  if (content === "drawing") {
    // The same cat drawing appears only where this state says a copy exists.
    c.beginPath(); c.moveTo(104, 114); c.lineTo(94, 48); c.lineTo(146, 78);
    c.quadraticCurveTo(192, 60, 238, 78); c.lineTo(290, 48); c.lineTo(280, 114);
    c.bezierCurveTo(308, 196, 263, 237, 192, 237);
    c.bezierCurveTo(121, 237, 76, 196, 104, 114); c.stroke();
    c.beginPath(); c.arc(151, 144, 8, 0, Math.PI * 2); c.arc(233, 144, 8, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(182, 176); c.lineTo(202, 176); c.lineTo(192, 187); c.closePath(); c.fill();
    for (const side of [-1, 1]) for (const offset of [-13, 12]) {
      c.beginPath(); c.moveTo(192 + side * 73, 180 + offset); c.lineTo(192 + side * 132, 175 + offset * 1.8); c.stroke();
    }
  } else if (content === "contacts") {
    for (let row = 0; row < 3; row++) {
      const y = 54 + row * 87;
      c.beginPath(); c.arc(51, y, 17, 0, Math.PI * 2); c.fill();
      c.fillRect(31, y + 17, 40, 15);
      c.fillStyle = INK; c.fillRect(100, y - 7, 156 - row * 22, 11); c.fillStyle = BLUE;
    }
  } else if (content === "music") {
    c.fillStyle = PAPER; c.font = "bold 125px sans-serif"; c.fillText("♪", 135, 177);
    c.fillStyle = BLUE; c.fillRect(60, 223, 260, 7);
  } else if (content === "work") {
    c.font = "600 31px monospace"; c.fillText("RAM", 28, 48);
    for (let row = 0; row < 3; row++) for (let column = 0; column < 5 - row; column++) c.fillRect(28 + column * 65, 82 + row * 58, 45, 32);
  } else {
    c.fillStyle = content === "code" ? PAPER : INK;
    if (ink === undefined) {
      c.font = "500 32px sans-serif";
      c.fillText(content === "names" ? language === "mn" ? "Нэрс" : "Names" : content === "code" ? "Code" : language === "mn" ? "Бичвэр" : "Text", 25, 53);
      for (let row = 0; row < 4; row++) c.fillRect(25, 94 + row * 43, row % 2 ? 237 : 304, 8);
    } else paintSceneInk(c, ink);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  return texture;
}

function face(parent: Group, content: SceneContent | undefined, language: SceneLanguage, width: number, height: number, at: Position, dark = false, ink?: string) {
  const map = content ? contentTexture(content, language, width, height, ink) : undefined;
  const mesh = addMesh(parent, new PlaneGeometry(width, height), dark ? INK : PAPER, at,
    new MeshBasicMaterial({ color: map ? "#ffffff" : dark ? INK : PAPER, map: map ?? null }));
  mesh.userData = { content: content ?? "empty", ink: content ? ink : undefined };
  return mesh;
}

function file(parent: Group, content: SceneContent | undefined, language: SceneLanguage, color: string, ink?: string) {
  box(parent, [1.06, 1.37, .09], [0, .74, 0], color);
  face(parent, content, language, .92, 1.17, [0, .74, .048], false, ink);
  // A folded corner distinguishes a document from an app window.
  const fold = new Shape(); fold.moveTo(0, 0); fold.lineTo(.22, 0); fold.lineTo(.22, -.22); fold.closePath();
  addMesh(parent, new ShapeGeometry(fold), PALE, [.31, 1.425, .052]);
}

function windowPanel(parent: Group, content: SceneContent | undefined, language: SceneLanguage, color: string, dark = false, ink?: string) {
  box(parent, [1.72, 1.23, .16], [0, .7, 0], color);
  box(parent, [1.56, .15, .02], [0, 1.2, .092], dark ? INK : PAPER);
  for (const x of [-.62, -.49, -.36]) addMesh(parent, new SphereGeometry(.026, 8, 6), dark ? PAPER : BLUE, [x, 1.2, .11]);
  face(parent, content, language, 1.55, .94, [0, .625, .085], dark, ink);
}

function monitor(parent: Group, content: SceneContent | undefined, language: SceneLanguage, color: string, ink?: string) {
  box(parent, [.84, .12, .6], [0, .08, 0], MUTED).name = "computer-base";
  box(parent, [.13, .45, .14], [0, .3, 0], INK).name = "computer-stand";
  box(parent, [1.58, 1.05, .22], [0, 1.01, 0], INK);
  face(parent, content, language, 1.4, .83, [0, 1.045, .112], false, ink);
  box(parent, [1.38, .06, .02], [0, .535, .119], color);
}

function workspace(parent: Group, content: SceneContent | undefined, language: SceneLanguage, color: string, ink?: string) {
  // This is the software workspace itself: its windows, top bar and dock.
  // It has neither the case nor the stand of the separate computer model.
  box(parent, [1.94, 1.38, .075], [0, .75, 0], PALE);
  box(parent, [1.94, .105, .03], [0, 1.395, .055], INK);
  box(parent, [.25, .024, .012], [-.74, 1.395, .076], PAPER);
  const rear = new Group();
  windowPanel(rear, undefined, language, MUTED);
  rear.scale.setScalar(.52); rear.position.set(.31, .44, .08); parent.add(rear);
  const front = new Group();
  windowPanel(front, content, language, color, false, ink);
  front.scale.setScalar(.65); front.position.set(-.21, .3, .23); parent.add(front);
  box(parent, [1.01, .145, .05], [0, .175, .09], INK).name = "workspace-dock";
  for (const x of [-.32, -.11, .11, .32]) box(parent, [.12, .085, .025], [x, .175, .13], x < 0 ? PAPER : color);
}

function shield(parent: Group, color: string) {
  const shape = new Shape(); shape.moveTo(-.52, 1.22); shape.lineTo(0, 1.4); shape.lineTo(.52, 1.22); shape.lineTo(.43, .57); shape.lineTo(0, .17); shape.lineTo(-.43, .57); shape.closePath();
  addMesh(parent, new ExtrudeGeometry(shape, { depth: .12, bevelEnabled: false }), color, [0, 0, 0]);
  line(parent, [-.25, .84, .16], [-.07, .65, .16], .046, PAPER);
  line(parent, [-.07, .65, .16], [.29, 1.02, .16], .046, PAPER);
}

/** Pure mesh construction also lets the layout tests measure every actual model. */
export function buildSceneObject(node: SceneNode, language: SceneLanguage): SceneObjectAsset {
  const model = new Group();
  const accent = node.tone === "blocked" ? AMBER : node.tone === "muted" ? MUTED : BLUE;
  const ink = node.ink ? sceneWords(node.ink, language) : undefined;
  switch (node.kind) {
    case "app": case "process":
      windowPanel(model, node.content, language, accent, false, ink);
      break;
    case "desktop":
      workspace(model, node.content, language, accent, ink);
      break;
    case "computer":
      monitor(model, node.content, language, accent, ink);
      break;
    case "terminal":
      windowPanel(model, node.content, language, INK, true, ink);
      // Prompt belongs to the shell even when no output has been requested.
      line(model, [-.66, .99, .1], [-.58, .94, .1], .012, PAPER);
      line(model, [-.58, .94, .1], [-.66, .89, .1], .012, PAPER);
      break;
    case "image-file": case "text-file":
      file(model, node.content, language, node.kind === "text-file" ? INK : accent, ink);
      break;
    case "code":
      file(model, node.content, language, INK, ink);
      break;
    case "cpu": case "cpu-core": {
      box(model, [1.35, .14, 1.35], [0, .21, 0], accent);
      box(model, [.87, .15, .87], [0, .355, 0], INK);
      if (node.kind === "cpu-core") {
        for (const x of [-.2, .2]) for (const z of [-.2, .2]) box(model, [.29, .025, .29], [x, .445, z], x < 0 && z > 0 ? BLUE : MUTED);
      } else box(model, [.7, .025, .7], [0, .445, 0], node.tone === "active" ? PALE : MUTED);
      for (const a of [-.45, -.15, .15, .45]) for (const side of [-1, 1]) {
        box(model, [.13, .06, .22], [a, .16, side * .73], MUTED);
        box(model, [.22, .06, .13], [side * .73, .16, a], MUTED);
      }
      break;
    }
    case "ram":
      box(model, [1.9, .12, .72], [0, .19, 0], accent);
      for (const x of [-.66, -.22, .22, .66]) box(model, [.3, .13, .42], [x, .315, 0], INK);
      for (const x of [-.75, -.5, -.25, 0, .25, .5, .75]) box(model, [.13, .055, .2], [x, .15, .43], "#b29557");
      if (node.content) {
        // Working data is a separate, removable overlay, not part of the RAM chips.
        const data = new Group(); file(data, node.content, language, accent, ink);
        data.scale.setScalar(.48); data.position.set(0, .36, -.09); model.add(data);
      }
      break;
    case "storage":
      box(model, [1.55, .86, .88], [0, .46, 0], INK);
      box(model, [1.36, .68, .035], [0, .47, .456], PALE);
      box(model, [.47, .055, .045], [0, .72, .49], INK);
      if (node.content) face(model, node.content, language, .73, .46, [0, .4, .48], false, ink);
      addMesh(model, new SphereGeometry(.03, 8, 6), accent, [.57, .25, .487]);
      break;
    case "server":
      box(model, [1.12, 1.47, .77], [0, .77, 0], INK);
      for (const y of [.3, .75, 1.2]) {
        box(model, [.98, .32, .025], [0, y, .4], PALE);
        for (const x of [-.37, -.25]) addMesh(model, new SphereGeometry(.025, 8, 6), accent, [x, y, .42]);
        box(model, [.34, .022, .02], [.14, y, .424], INK);
      }
      if (node.content) {
        const copy = new Group(); file(copy, node.content, language, accent, ink);
        copy.scale.setScalar(.63); copy.position.set(.45, .04, .65); model.add(copy);
      }
      break;
    case "contacts":
      box(model, [1.05, 1.4, .18], [0, .75, 0], accent);
      for (const y of [.37, .75, 1.13]) box(model, [.11, .22, .05], [.55, y, .04], PALE);
      face(model, node.content, language, .88, 1.2, [0, .75, .095], false, ink);
      break;
    case "person":
      addMesh(model, new SphereGeometry(.28, 18, 12), accent, [0, 1.12, 0]);
      addMesh(model, new CylinderGeometry(.2, .44, .73, 18), PALE, [0, .47, 0]);
      break;
    case "software":
      // A collection of software windows, rather than a slab resembling hardware.
      box(model, [1.25, .92, .1], [-.21, .9, -.13], PALE);
      box(model, [1.25, .92, .1], [.02, .72, -.005], accent);
      face(model, node.content, language, 1.03, .7, [.02, .68, .052], false, ink);
      break;
    case "shield": shield(model, accent); break;
    case "key": {
      addMesh(model, new TorusGeometry(.28, .09, 10, 24), accent, [-.37, .77, 0]);
      box(model, [.82, .16, .16], [.21, .77, 0], accent);
      box(model, [.14, .3, .16], [.57, .64, 0], accent);
      box(model, [.12, .24, .16], [.3, .67, 0], accent);
      break;
    }
    case "package":
      box(model, [1.1, 1.03, .88], [0, .55, 0], PALE);
      box(model, [.22, 1.045, .9], [0, .55, 0], accent);
      box(model, [.29, .22, .018], [-.31, .62, .451], PAPER);
      if (node.content) face(model, node.content, language, .61, .53, [.11, .53, .461], false, ink);
      break;
    case "folder":
      box(model, [1.51, 1.05, .09], [0, .58, -.17], PALE);
      box(model, [.6, .2, .09], [-.39, 1.15, -.17], PALE);
      if (node.content) {
        const document = new Group(); file(document, node.content, language, accent, ink);
        document.scale.setScalar(.7); document.position.set(.15, .26, -.04); model.add(document);
      }
      box(model, [1.51, .75, .11], [0, .42, .16], accent);
      break;
  }
  if (node.tone === "blocked") {
    // A visible bar states blocked access without inventing a travelling packet.
    const mark = new Group();
    addMesh(mark, new TorusGeometry(.115, .029, 8, 20), AMBER, [0, 0, 0]);
    line(mark, [-.08, -.08, .025], [.08, .08, .025], .021, AMBER);
    mark.position.set(.77, .18, .61); model.add(mark);
  }
  const physicalBoard = node.kind === "cpu" || node.kind === "cpu-core" || node.kind === "ram";
  model.rotation.set(physicalBoard ? .52 : .08, -.23, 0);
  model.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(model);
  const center = bounds.getCenter(new Vector3());
  const size = bounds.getSize(new Vector3());
  model.position.sub(center);
  const object = new Group(); object.add(model); object.updateMatrixWorld(true);
  object.userData = { kind: node.kind, content: node.content ?? "empty", tone: node.tone ?? "normal" };
  return { object, width: size.x, height: size.y };
}

export function disposeSceneObject(asset: SceneObjectAsset) {
  const materials = new Set<Material>();
  asset.object.traverse(object => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
  });
  for (const material of materials) {
    const map = (material as MeshBasicMaterial).map;
    map?.dispose();
    material.dispose();
  }
}

export default function SceneObject({ asset, scale, position }: { asset: SceneObjectAsset; scale: number; position: Position }) {
  return <group position={position} scale={scale}><primitive object={asset.object} dispose={null} /></group>;
}
