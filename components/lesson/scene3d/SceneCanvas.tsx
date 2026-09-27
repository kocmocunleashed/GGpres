"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Component, type ReactNode, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { OrthographicCamera } from "three";
import { sceneWords, type SceneLanguage, type SceneState } from "@/lib/lesson-scene";
import { layoutLessonScene, sceneRelationPath, type SceneCell } from "@/lib/lesson-scene-layout";
import SceneObject, { buildSceneObject, disposeSceneObject, type SceneObjectAsset } from "./SceneObjects";
import "./scene-canvas.css";

interface Props {
  state: SceneState;
  language: SceneLanguage;
  paused: boolean;
  onUnavailable: () => void;
  onReady?: () => void;
}

class RendererBoundary extends Component<{ onFailure: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Stage({ assets, cells, onReady }: { assets: readonly SceneObjectAsset[]; cells: readonly SceneCell[]; onReady: () => void }) {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    // A front camera gives HTML and meshes the exact same CSS-pixel coordinate
    // system. Each object carries its own modest rotation to reveal its depth.
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = 100;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    invalidate();
    onReady();
  }, [camera, invalidate, onReady, size.width, size.height]);
  return <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[-3, 6, 8]} intensity={2.1} />
    {cells.map((cell, index) => <SceneObject key={cell.id} asset={assets[index]} scale={cell.scale} position={[(cell.centerX - size.width / 2) / 100, (size.height / 2 - cell.centerY) / 100, 0]} />)}
  </>;
}

/** Static scene: only explicit state changes and resizes request a render.
 * There is no animation loop to run while paused, offscreen or in a hidden tab. */
export default function SceneCanvas({ state, language, paused, onUnavailable, onReady }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const readySent = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [labelHeights, setLabelHeights] = useState<Record<string, number>>({});
  const [failed, setFailed] = useState(false);
  const marker = useId().replace(/:/g, "");
  const assets = useMemo(() => state.nodes.map(node => buildSceneObject(node, language)), [state.nodes, language]);
  const fail = useCallback(() => { setFailed(true); onUnavailable(); }, [onUnavailable]);
  const contextLost = useCallback((event: Event) => { event.preventDefault(); fail(); }, [fail]);
  const ready = useCallback(() => {
    if (readySent.current) return;
    readySent.current = true;
    onReady?.();
  }, [onReady]);
  const nodesKey = state.nodes.map(node => node.id).join("|");
  const cells = useMemo(() => layoutLessonScene(size.width, size.height,
    state.nodes.map((node, index) => ({ id: node.id, extent: assets[index], labelHeight: labelHeights[node.id] })), !!state.container),
  [size.width, size.height, state.nodes, state.container, assets, labelHeights]);

  useEffect(() => () => assets.forEach(disposeSceneObject), [assets]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width <= 0 || height <= 0) return;
      setSize(previous => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const labels = root.current?.querySelectorAll<HTMLElement>(".scene3d-node-label");
    if (!labels?.length) return;
    const observer = new ResizeObserver(() => {
      const next: Record<string, number> = {};
      labels.forEach(label => { next[label.dataset.node!] = Math.ceil(label.getBoundingClientRect().height); });
      setLabelHeights(previous => Object.keys(next).every(key => previous[key] === next[key]) ? previous : next);
    });
    labels.forEach(label => observer.observe(label));
    return () => observer.disconnect();
  }, [nodesKey, size.width]);
  useEffect(() => () => canvas.current?.removeEventListener("webglcontextlost", contextLost), [contextLost]);

  return <div ref={root} className="scene3d-canvas" aria-hidden="true" data-paused={paused} data-render-mode="demand" data-node-count={state.nodes.length} data-layout={state.nodes.length === 4 && size.width < 520 ? "two-rows" : "one-row"}>
    {state.container && <div className="scene3d-container"><span>{sceneWords(state.container, language)}</span></div>}
    {!failed && size.width > 0 && <RendererBoundary onFailure={fail}>
      <Canvas orthographic camera={{ position: [0, 0, 20], zoom: 100, near: .1, far: 50 }} dpr={[1, 1.25]} frameloop="demand" gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} fallback={<span>{language === "mn" ? "3D харагдац ажиллахгүй байна." : "3D view unavailable."}</span>} onCreated={({ gl }) => {
        gl.setClearColor("#f2f1e8", 0);
        canvas.current = gl.domElement;
        gl.domElement.addEventListener("webglcontextlost", contextLost);
      }}>
        <Stage assets={assets} cells={cells} onReady={ready} />
      </Canvas>
    </RendererBoundary>}
    {!!state.relations?.length && cells.length > 0 && <svg className="scene3d-connectors" viewBox={`0 0 ${size.width} ${size.height}`}>
      <defs><marker id={marker} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 1 1 L 7 4 L 1 7" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
      {state.relations.map((relation, index) => {
        const from = cells.find(cell => cell.id === relation.from), to = cells.find(cell => cell.id === relation.to);
        return from && to ? <path key={`${relation.from}-${relation.to}-${index}`} data-relation={relation.kind} d={sceneRelationPath(from, to, cells)} markerEnd={`url(#${marker})`} /> : null;
      })}
    </svg>}
    {cells.map((cell, index) => {
      const node = state.nodes[index];
      return <div key={node.id} className="scene3d-node-label" data-node={node.id} data-tone={node.tone ?? "normal"} style={{ left: cell.labelLeft, top: cell.labelTop, width: cell.labelWidth }}>
        <strong>{sceneWords(node.label, language)}</strong>
        {node.status && <span className="scene3d-node-status">{sceneWords(node.status, language)}</span>}
      </div>;
    })}
  </div>;
}
