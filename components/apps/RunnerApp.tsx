"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Pause, Play, RotateCcw } from "lucide-react";
import { isRunnerFocused, isRunnerSnapshot, type RunnerSnapshot } from "@/lib/runner";
import { useSystemStore } from "@/store/system";
import "./runner.css";

type Control = "jump" | "duck";
const initialSnapshot: RunnerSnapshot = { source: "opitlcal-runner", type: "status", status: "ready", score: 0, best: 0 };

export default function RunnerApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const activeControl = useRef<Control | null>(null);
  const focused = useSystemStore((state) => isRunnerFocused(state.windows, state.lessonPresenting));
  const theme = useSystemStore((state) => state.theme);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [available, setAvailable] = useState(false);
  const [generation, setGeneration] = useState(0);
  const post = useCallback((message: Record<string, unknown>) => {
    frameRef.current?.contentWindow?.postMessage({ source: "opitlcal-runner-host", ...message }, window.location.origin);
  }, []);
  const enabled = focused && available;

  useEffect(() => {
    const root = rootRef.current;
    function checkAvailability() { setAvailable(!document.hidden && !!root && !root.closest("[inert]")); }
    const observer = new MutationObserver(checkAvailability);
    for (let ancestor = root?.parentElement; ancestor; ancestor = ancestor.parentElement) observer.observe(ancestor, { attributes: true, attributeFilter: ["inert"] });
    checkAvailability();
    document.addEventListener("visibilitychange", checkAvailability);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", checkAvailability); };
  }, []);

  useEffect(() => {
    function receive(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (isRunnerSnapshot(event.data)) { setSnapshot(event.data); setLoaded(true); }
      else if (event.data && typeof event.data === "object" && "source" in event.data && event.data.source === "opitlcal-runner" && "type" in event.data && event.data.type === "error") setError(true);
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    function pauseOutside(event: Event) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) post({ type: "command", action: "pause" });
    }
    document.addEventListener("pointerdown", pauseOutside, true);
    document.addEventListener("focusin", pauseOutside);
    return () => { document.removeEventListener("pointerdown", pauseOutside, true); document.removeEventListener("focusin", pauseOutside); };
  }, [post]);

  useEffect(() => { post({ type: "state", enabled, theme }); }, [enabled, theme, loaded, generation, post]);
  useEffect(() => {
    const timer = window.setTimeout(() => { if (!loaded) setError(true); }, 12000);
    return () => window.clearTimeout(timer);
  }, [loaded, generation]);

  function start() { post({ type: "command", action: "start" }); frameRef.current?.focus(); }
  function release() {
    if (activeControl.current) post({ type: "input", control: activeControl.current, pressed: false });
    activeControl.current = null;
  }
  function press(event: PointerEvent<HTMLButtonElement>, control: Control) {
    if (!enabled || snapshot.status !== "playing") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    activeControl.current = control;
    post({ type: "input", control, pressed: true });
  }
  const playing = snapshot.status === "playing";
  const statusLabel = snapshot.status === "crashed" ? "Game over" : snapshot.status === "paused" ? "Run paused" : "Ready when you are";
  return <div ref={rootRef} className="app-runner" data-status={snapshot.status}>
    <header className="runner-toolbar"><div><span className="runner-eyebrow">OFFLINE ARCADE</span><h2>A little break.</h2></div><div className="runner-scores"><span>HI <strong>{String(Math.max(snapshot.best, snapshot.score)).padStart(5, "0")}</strong></span><span>SCORE <strong>{String(snapshot.score).padStart(5, "0")}</strong></span></div></header>
    <div className="runner-stage">
      <div className="runner-field">
        <iframe key={generation} ref={frameRef} src="/games/runner/index.html" title="Dino Runner game canvas" onLoad={() => post({ type: "state", enabled, theme })} tabIndex={playing ? 0 : -1} />
        {(!loaded || !playing || error) && <div className="runner-overlay">
          <span className="runner-state" role="status">{error ? "The game could not load." : !loaded ? "Getting the desert ready…" : statusLabel}</span>
          {error ? <button onClick={() => { setError(false); setLoaded(false); setSnapshot(initialSnapshot); setGeneration((value) => value + 1); }}><RotateCcw size={15} /> Try again</button> : loaded && <button data-initial-focus onClick={start} disabled={!enabled}>{snapshot.status === "crashed" ? <RotateCcw size={15} /> : <Play size={15} fill="currentColor" />}{snapshot.status === "crashed" ? "Run again" : snapshot.status === "paused" ? "Resume run" : "Start running"}</button>}
        </div>}
      </div>
    </div>
    <div className="runner-controls"><div className="runner-inputs">
      <button aria-label="Jump" disabled={!playing || !enabled} onPointerDown={(event) => press(event, "jump")} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onClick={(event) => { if (event.detail === 0) { post({ type: "input", control: "jump", pressed: true }); window.setTimeout(() => post({ type: "input", control: "jump", pressed: false }), 180); } }}><ArrowUp size={16} /><span>Jump</span><kbd>Space</kbd></button>
      <button aria-label="Duck" disabled={!playing || !enabled} onPointerDown={(event) => press(event, "duck")} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onKeyDown={(event) => { if ([" ", "Enter"].includes(event.key)) { event.preventDefault(); post({ type: "input", control: "duck", pressed: true }); } }} onKeyUp={(event) => { if ([" ", "Enter"].includes(event.key)) { event.preventDefault(); post({ type: "input", control: "duck", pressed: false }); } }}><ArrowDown size={16} /><span>Duck</span><kbd>↓</kbd></button>
    </div><button className="runner-pause" disabled={!playing} onClick={() => post({ type: "command", action: "pause" })}><Pause size={15} /><span>Pause</span></button></div>
    <footer className="runner-footer"><span>Chromium’s classic. No connection needed.</span><a href="/games/runner/SOURCE.md" target="_blank" rel="noreferrer" aria-label="Dino Runner open-source credits and license">Open source <ExternalLink size={11} /></a></footer>
  </div>;
}
