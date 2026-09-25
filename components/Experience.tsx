"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Camera, Expand, Hand, MousePointer2, Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "motion/react";
import StartGate from "@/components/entry/StartGate";
import { useSystemStore } from "@/store/system";
import { playTone } from "@/lib/audio";
import { useRoomStore } from "@/store/room";
import RoomControls from "@/components/world3d/RoomControls";
import type { DesktopMessage, WorkstationView } from "@/lib/desktop-bridge";
import "@/components/entry/entry.css";

const Workstation = dynamic(() => import("@/components/world3d/WorkstationScene"), {
  ssr: false,
  loading: () => <div className="experience-loading" role="status">Loading workstation…</div>,
});

function SessionClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  return <time suppressHydrationWarning>{time.toLocaleTimeString("en-GB")}</time>;
}

function PourClock() {
  const pouring = useRoomStore((state) => state.pouring);
  useEffect(() => {
    if (!pouring) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      if (now - previous >= 33) {
        useRoomStore.getState().tick((now - previous) / 1000);
        previous = now;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pouring]);
  return null;
}

export default function Experience() {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<WorkstationView>("loading");
  const [expanded, setExpanded] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [graphicsFallback, setGraphicsFallback] = useState(false);
  const muted = useSystemStore((s) => s.muted);
  const reducedMotion = useSystemStore((s) => s.reducedMotion);
  const motionPaused = useSystemStore((s) => s.motionPaused);
  const systemReduced = useReducedMotion();
  const powerOn = useRoomStore((state) => state.powerOn);
  const handleReady = useCallback(() => setReady(true), []);
  const handleFallback = useCallback(() => {
    useRoomStore.getState().cleanUp();
    setGraphicsFallback(true);
  }, []);

  const handleDesktopMessage = useCallback((message: DesktopMessage) => {
    if (message.type === "preferences") {
      const state = useSystemStore.getState();
      if (state.muted !== message.muted || state.reducedMotion !== message.reducedMotion || state.motionPaused !== message.motionPaused) {
        useSystemStore.setState({ muted: message.muted, reducedMotion: message.reducedMotion, motionPaused: message.motionPaused });
      }
    } else if (message.type === "presentation") {
      setPresenting(message.active);
      if (message.active) setView("monitor");
    } else if (message.type === "view") {
      setExpanded(message.action === "expand");
      setView(message.action === "desk" ? "desk" : "monitor");
    } else if (message.type === "restart") {
      useRoomStore.getState().reset();
      setStarted(false);
      setExpanded(false);
      setPresenting(false);
      setView("loading");
    }
  }, []);

  useEffect(() => useRoomStore.subscribe((state, previous) => {
    if (state.held && !previous.held || state.noteOpen && !previous.noteOpen || !state.powerOn && previous.powerOn) {
      setExpanded(false);
      setPresenting(false);
      setView("room");
    }
  }), []);

  useEffect(() => {
    if (!started || expanded || presenting || view === "room") return;
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key !== "Escape") return;
      if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable=true]")) return;
      if (view === "monitor") setView("desk");
      else if (view === "desk" || view === "orbit") setView("overview");
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [started, expanded, presenting, view]);

  function start() { setStarted(true); setView("overview"); }
  function skip() { setStarted(true); setView("monitor"); setExpanded(true); }
  function toggleSound() { useSystemStore.getState().setMuted(!muted); if (muted) playTone(); }
  function leaveRoom() {
    useRoomStore.getState().putDown();
    useRoomStore.getState().closeNote();
    useRoomStore.getState().setHovered(null);
    setView("desk");
  }

  return <main className="experience" data-reduced-motion={reducedMotion || !!systemReduced} data-motion-paused={motionPaused} data-computer-view={view}>
    <PourClock />
    <Workstation view={view} onViewChange={setView} expanded={expanded || presenting || graphicsFallback} muted={muted} reducedMotion={reducedMotion} motionPaused={motionPaused} onReady={handleReady} onFallback={handleFallback} onDesktopMessage={handleDesktopMessage} />
    {!started && <StartGate onStart={start} onSkip={skip} ready={ready} />}
    {started && !expanded && !presenting && !graphicsFallback && <>
      {(view === "desk" || view === "orbit" || view === "room") && <aside className="computer-info" aria-label="Workstation controls">
        <h1>Operating Systems</h1><p>WaveOS · Learning Edition</p>
        <div className="computer-info-row"><SessionClock /><button onClick={toggleSound} title={muted ? "Enable sound" : "Mute sound"} aria-label={muted ? "Enable sound" : "Mute sound"}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>{view !== "room" && <button onClick={() => setView(view === "orbit" ? "overview" : "orbit")} title={view === "orbit" ? "Return to computer" : "Free camera"} aria-label={view === "orbit" ? "Return to computer" : "Free camera"} aria-pressed={view === "orbit"}>{view === "orbit" ? <MousePointer2 size={16} /> : <Camera size={17} />}</button>}</div>
      </aside>}
      {view === "room" ? <RoomControls onExit={leaveRoom} /> : <nav className="computer-navigation" aria-label="Computer views">
        {view === "overview" && <button className="computer-prompt" onClick={() => setView("desk")}>Click anywhere to begin <span className="computer-cursor" aria-hidden="true" /></button>}
        {view === "desk" && <><button className="computer-prompt" disabled={!powerOn} onClick={() => setView("monitor")}>{powerOn ? "Use the computer" : "Computer is off"} <span aria-hidden="true">↗</span></button><button onClick={() => setView("room")}><Hand size={15} />Explore the desk</button></>}
        {view === "orbit" && <><span className="computer-instruction">Drag to look around · Scroll to zoom</span><button onClick={() => setView("room")}><Hand size={15} />Explore the desk</button><button onClick={() => setView("desk")}><ArrowLeft size={15} />Return to computer</button></>}
        {view === "monitor" && <><button onClick={() => setView("desk")}><ArrowLeft size={15} />Back to desk</button><button onClick={() => setExpanded(true)}><Expand size={15} />Expand desktop</button></>}
      </nav>}
    </>}
  </main>;
}
