"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, type RefObject, Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PerspectiveCamera } from "three";
import type { DesktopMessage, WorkstationView } from "@/lib/desktop-bridge";
import CameraRig from "./CameraRig";
import ComputerModel from "./ComputerModel";
import CSS3DScreen, { type ScreenProjection } from "./CSS3DScreen";
import FilmGrain from "./FilmGrain";
import { useRoomStore } from "@/store/room";
import "./workstation.css";

export { preloadWorkstationAssets } from "./ComputerModel";

interface WorkstationSceneProps {
  view: WorkstationView;
  onViewChange: (view: WorkstationView) => void;
  expanded: boolean;
  muted: boolean;
  reducedMotion: boolean;
  motionPaused: boolean;
  onReady: () => void;
  onFallback?: () => void;
  onDesktopMessage: (message: DesktopMessage) => void;
}

function subscribeToMotionPreference(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function getMotionPreference() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function getServerMotionPreference() { return false; }

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function ProjectScreen({ projectionRef, expanded }: { projectionRef: RefObject<ScreenProjection | null>; expanded: boolean }) {
  // CameraRig registers first, so the two renderers use the same camera each frame.
  useFrame(({ camera }) => { if (!expanded) projectionRef.current?.render(camera as PerspectiveCamera); });
  return null;
}

/** Source workstation: Henry Heffernan's MIT-licensed portfolio. Its original
 * meshes, baked lighting and camera choreography surround our own live desktop. */
export default function WorkstationScene(props: WorkstationSceneProps) {
  const { onReady, onFallback } = props;
  const systemReducedMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, getServerMotionPreference);
  const shouldReduceMotion = props.reducedMotion || systemReducedMotion;
  const [assetsReady, setAssetsReady] = useState(false);
  const [desktopReady, setDesktopReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const announcedReady = useRef(false);
  const announcedFallback = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const projectionRef = useRef<ScreenProjection | null>(null);
  const handleAssetsReady = useCallback(() => setAssetsReady(true), []);
  const handleDesktopReady = useCallback(() => setDesktopReady(true), []);
  const handleFailure = useCallback(() => setFailed(true), []);
  const expanded = props.expanded || failed;
  const paused = shouldReduceMotion || props.motionPaused;
  const powerOn = useRoomStore((state) => state.powerOn);
  const held = useRoomStore((state) => state.held);
  const noteOpen = useRoomStore((state) => state.noteOpen);

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    setFailed(true);
  }, []);
  useEffect(() => () => {
    canvasRef.current?.removeEventListener("webglcontextlost", handleContextLost);
  }, [handleContextLost]);
  useEffect(() => {
    if (!announcedReady.current && desktopReady && (assetsReady || failed)) {
      announcedReady.current = true;
      onReady();
    }
  }, [assetsReady, desktopReady, failed, onReady]);

  useEffect(() => {
    if (failed && !announcedFallback.current) {
      announcedFallback.current = true;
      onFallback?.();
    }
  }, [failed, onFallback]);

  function sceneClick() {
    if (useRoomStore.getState().held || useRoomStore.getState().noteOpen) return;
    if (props.view === "overview") props.onViewChange("desk");
    else if (props.view === "desk") props.onViewChange("overview");
  }
  function screenClick() {
    if (useRoomStore.getState().held || !useRoomStore.getState().powerOn) return;
    if (props.view === "desk" || props.view === "overview") props.onViewChange("monitor");
  }
  function screenHover() {
    if (useRoomStore.getState().held || !useRoomStore.getState().powerOn) return;
    if (props.view === "desk" && !expanded) props.onViewChange("monitor");
  }

  return (
    <section className="world-scene" data-view={props.view} aria-label="Physical workstation">
      <CSS3DScreen projectionRef={projectionRef} view={props.view} expanded={expanded} canFrame={!failed} powered={powerOn} muted={props.muted} reducedMotion={props.reducedMotion} motionPaused={props.motionPaused} onReady={handleDesktopReady} onViewChange={props.onViewChange} onDesktopMessage={props.onDesktopMessage} />
      <div className={`world-canvas${props.view === "monitor" ? " is-monitor" : ""}${expanded ? " is-expanded" : ""}`} aria-hidden="true">
        <SceneBoundary onFailure={handleFailure}>
          {!failed && (
            <Canvas
              camera={{ position: [-35000 / 900, 35000 / 900, 35000 / 900], fov: 35, near: 10 / 900, far: 1000 }}
              dpr={[1, 1.5]}
              flat
              frameloop={expanded ? "never" : "always"}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              onPointerMissed={sceneClick}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                canvasRef.current = gl.domElement;
                gl.domElement.addEventListener("webglcontextlost", handleContextLost, false);
              }}
            >
              <Suspense fallback={null}>
                <ComputerModel onClick={sceneClick} onScreenActivate={screenClick} onScreenHover={screenHover} onReady={handleAssetsReady} paused={paused} interactive={!noteOpen && (props.view === "desk" || props.view === "room" || props.view === "orbit")} />
              </Suspense>
              <CameraRig view={props.view} reducedMotion={shouldReduceMotion} motionPaused={props.motionPaused} expanded={expanded} interactionLocked={held || noteOpen} />
              <ProjectScreen projectionRef={projectionRef} expanded={expanded} />
            </Canvas>
          )}
        </SceneBoundary>
      </div>
      <FilmGrain paused={paused} hidden={expanded} />
    </section>
  );
}
