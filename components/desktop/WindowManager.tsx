import dynamic from "next/dynamic";
import { Maximize2, Minus, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useSystemStore, type AppId, type WindowState } from "@/store/system";
import AppIcon from "./AppIcon";

const Loading = () => <div className="desktop-app-loading" role="status">Opening application…</div>;
const apps = {
  lesson: dynamic(() => import("@/components/apps/LessonApp"), { loading: Loading }),
  files: dynamic(() => import("@/components/apps/FilesApp"), { loading: Loading }),
  terminal: dynamic(() => import("@/components/apps/TerminalApp"), { loading: Loading }),
  "system-monitor": dynamic(() => import("@/components/apps/SystemMonitorApp"), { loading: Loading }),
  settings: dynamic(() => import("@/components/apps/SettingsApp"), { loading: Loading }),
  about: dynamic(() => import("@/components/apps/AboutApp"), { loading: Loading }),
  software: dynamic(() => import("@/components/apps/SoftwareApp"), { loading: Loading }),
} satisfies Record<AppId, React.ComponentType>;

function AppWindow({ win, focused, viewport }: { win: WindowState; focused: boolean; viewport: { width: number; height: number } }) {
  const windowRef = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const width = Math.min(win.width, viewport.width - 24);
  const height = Math.min(win.height, viewport.height - 144);
  const left = Math.max(12, Math.min(win.x, viewport.width - width - 12));
  const top = Math.max(10, Math.min(win.y, viewport.height - 134 - height));
  const App = apps[win.appId];

  useEffect(() => {
    if (focused && !win.minimized && !windowRef.current?.contains(document.activeElement)) {
      const target = windowRef.current?.querySelector<HTMLElement>("input, [data-initial-focus]") ?? windowRef.current;
      target?.focus({ preventScroll: true });
    }
  }, [focused, win.minimized, win.zIndex]);

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (win.maximized || (event.target as HTMLElement).closest("button") || event.button !== 0) return;
    drag.current = { x: left, y: top, startX: event.clientX, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    const x = Math.max(12, Math.min(viewport.width - width - 12, drag.current.x + event.clientX - drag.current.startX));
    const y = Math.max(10, Math.min(viewport.height - 176, drag.current.y + event.clientY - drag.current.startY));
    useSystemStore.getState().moveWindow(win.id, x, y);
  }
  return <section ref={windowRef} tabIndex={-1} role="region" aria-label={`${win.title} window`} data-app-id={win.appId} className={`desktop-window ${focused ? "is-focused" : ""} ${win.maximized ? "is-maximized" : ""}`} style={{ display: win.minimized ? "none" : "flex", width: win.maximized ? "calc(100% - 16px)" : width, height: win.maximized ? "calc(100% - 8px)" : height, left: win.maximized ? 8 : left, top: win.maximized ? 8 : top, zIndex: win.zIndex }} onPointerDownCapture={() => { if (!focused) useSystemStore.getState().focusWindow(win.id); }} onFocusCapture={() => { if (!focused) useSystemStore.getState().focusWindow(win.id); }}>
    <header className="desktop-window-titlebar" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onDoubleClick={(event) => { if (!(event.target as HTMLElement).closest("button")) useSystemStore.getState().toggleMaximize(win.id); }}>
      <AppIcon appId={win.appId} size={23} />
      <span className="desktop-window-title" tabIndex={0} title="Drag to move. Double-click to maximize. Alt + arrow keys to move with keyboard." onKeyDown={(event) => { if (event.altKey && event.key.startsWith("Arrow")) { event.preventDefault(); const dx = event.key === "ArrowRight" ? 30 : event.key === "ArrowLeft" ? -30 : 0; const dy = event.key === "ArrowDown" ? 30 : event.key === "ArrowUp" ? -30 : 0; useSystemStore.getState().moveWindow(win.id, Math.max(12, left + dx), Math.max(10, top + dy)); } }}>{win.title}</span>
      <div className="desktop-window-controls"><button onClick={() => useSystemStore.getState().minimizeWindow(win.id)} aria-label={`Minimize ${win.title}`} title="Minimize"><Minus size={14} /></button><button onClick={() => useSystemStore.getState().toggleMaximize(win.id)} aria-label={`${win.maximized ? "Restore" : "Maximize"} ${win.title}`} title={win.maximized ? "Restore" : "Maximize"}>{win.maximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}</button><button className="desktop-window-close" onClick={() => useSystemStore.getState().closeWindow(win.id)} aria-label={`Close ${win.title}`} title="Close"><X size={14} /></button></div>
    </header>
    <div className="desktop-window-content"><App /></div>
  </section>;
}

export default function WindowManager() {
  const windows = useSystemStore((s) => s.windows);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);
  const topWindow = windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.id;
  return <div className="desktop-windows">{windows.map((win) => <AppWindow key={win.id} win={win} focused={win.id === topWindow} viewport={viewport} />)}</div>;
}
