"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { useSystemStore } from "@/store/system";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Activities from "./Activities";
import WindowManager from "./WindowManager";
import Wallpaper from "./Wallpaper";
import AppIcon from "./AppIcon";
import NotificationToast from "./NotificationToast";
import "./desktop.css";
import "@/components/apps/apps.css";
import "./themes.css";

const LessonEngine = dynamic(() => import("@/components/lesson/LessonEngine"));

export default function DesktopShell({ onRestart, active = true, onBackToDesk, onToggleExpanded, expanded = false }: { onRestart: () => void; active?: boolean; onBackToDesk?: () => void; onToggleExpanded?: () => void; expanded?: boolean }) {
  const [overview, setOverview] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const theme = useSystemStore((s) => s.theme);
  const presenting = useSystemStore((s) => s.lessonPresenting);
  const lessonIndex = useSystemStore((s) => s.lessonIndex);
  const lessonComplete = useSystemStore((s) => s.lessonComplete);
  const notifications = useSystemStore((s) => s.notifications);
  const closeOverview = useCallback(() => setOverview(false), []);
  const toggleOverview = useCallback(() => setOverview((open) => !open), []);

  useEffect(() => {
    if (!active) return;
    function keydown(event: KeyboardEvent) {
      if (useSystemStore.getState().lessonPresenting) return;
      if (event.ctrlKey && event.code === "Space") { event.preventDefault(); setOverview((open) => !open); }
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const state = useSystemStore.getState();
      const visible = state.windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex);
      if (event.altKey && event.key === "F4" && visible[0]) { event.preventDefault(); state.closeWindow(visible[0].id); }
      if (event.altKey && event.key === "Tab" && state.windows.length > 1) {
        event.preventDefault();
        const ordered = [...state.windows].sort((a, b) => b.zIndex - a.zIndex);
        state.openApp(ordered[1].appId);
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [active]);

  const latest = notifications.at(-1);
  return <>
    <div className="desktop-shell" data-theme={theme} aria-label="opitlcalOS desktop" inert={presenting || !active}>
      <Wallpaper />
      <TopBar overview={overview} onActivities={toggleOverview} onRestart={onRestart} onBackToDesk={onBackToDesk} onToggleExpanded={onToggleExpanded} expanded={expanded} />
      <div className="desktop-shortcuts" aria-label="Desktop shortcuts">
        <button onClick={() => useSystemStore.getState().openApp("lesson")}><AppIcon appId="lesson" size={58} /><span>Operating<br />Systems</span><span className="desktop-shortcut-arrow"><ArrowUpRight size={10} /></span></button>
        <button onClick={() => useSystemStore.getState().openApp("files")}><AppIcon appId="files" size={56} /><span>Home</span></button>
      </div>
      <h1 className="sr-only">opitlcalOS desktop</h1>
      {welcome && !overview && <aside className="desktop-welcome" aria-labelledby="desktop-welcome-title">
        <AppIcon appId="lesson" size={40} />
        <div><h2 id="desktop-welcome-title">Make yourself at home.</h2><p>Open an app. Follow your curiosity.</p><button className="desktop-welcome-start" onClick={() => { setWelcome(false); useSystemStore.getState().openApp("lesson"); }}>Begin the lesson <ArrowUpRight size={15} /></button></div>
        <button className="desktop-welcome-close" aria-label="Dismiss welcome" title="Dismiss welcome" onClick={() => setWelcome(false)}><X size={16} /></button>
      </aside>}
      <WindowManager />
      {latest && !overview && <NotificationToast key={latest.id} notification={latest} />}
      {overview && <Activities onClose={closeOverview} />}
      <Dock onActivities={toggleOverview} overview={overview} />
      {lessonIndex > 0 && !lessonComplete && !overview && <button className="desktop-resume" onClick={() => { const state = useSystemStore.getState(); state.openApp("lesson"); state.setLessonPresenting(true); }}><Play size={13} fill="currentColor" /> Resume lesson <span>↗</span></button>}
      <div className="desktop-edition">opitlcalOS <span>·</span> Learning Edition</div>
    </div>
    {presenting && <LessonEngine />}
  </>;
}
