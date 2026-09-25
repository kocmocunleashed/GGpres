import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { APP_META, useSystemStore, type AppId } from "@/store/system";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import AppIcon from "./AppIcon";

const descriptions: Record<AppId, string> = {
  lesson: "An interactive journey beneath the interface",
  files: "Explore your folders and documents",
  terminal: "Talk to the system with commands",
  "system-monitor": "See processes, CPU, and memory",
  settings: "Make this workstation your own",
  about: "Meet your operating system",
  software: "A small, opinionated app collection",
};

export default function Activities({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const windows = useSystemStore((s) => s.windows);
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);
  const apps = (Object.keys(APP_META) as AppId[]).filter((id) => `${id} ${APP_META[id].title} ${descriptions[id]}`.toLowerCase().includes(query.trim().toLowerCase()));
  function open(id: AppId) { useSystemStore.getState().openApp(id); onClose(); }
  return <div className="desktop-activities" role="dialog" aria-modal="true" aria-label="Activities overview" ref={ref}>
    <div className="desktop-activities-header"><span>YOUR WORKSPACE</span><button aria-label="Close activities" onClick={onClose}><X size={20} /></button></div>
    <form className="desktop-search" onSubmit={(event) => { event.preventDefault(); if (apps[0]) open(apps[0]); }}><Search size={19} /><input data-initial-focus aria-label="Search applications" placeholder="Type to search…" value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>Esc</kbd></form>
    {windows.length > 0 && !query && <div className="desktop-overview-windows">{windows.map((win) => <button key={win.id} className="desktop-overview-preview" aria-label={`${win.minimized ? "Restore" : "Focus"} ${win.title}`} onClick={() => open(win.appId)}><span className="desktop-preview-bar"><span />{win.title}<span aria-hidden="true" /></span><AppIcon appId={win.appId} size={40} /><span className="desktop-preview-status">{win.minimized ? "Minimized" : "Running"} <span>·</span> PID {win.processId}</span></button>)}</div>}
    <div className="desktop-application-grid">{apps.map((id) => <button key={id} onClick={() => open(id)}><AppIcon appId={id} size={66} /><strong>{APP_META[id].title}</strong><span>{descriptions[id]}</span></button>)}</div>
    {!apps.length && <div className="desktop-search-empty"><Search size={30} /><h2>No applications found</h2><p>Try “Files”, “Terminal”, or “Lesson”.</p></div>}
    <div className="desktop-activities-hint"><kbd>Ctrl</kbd> + <kbd>Space</kbd> opens your workspace</div>
  </div>;
}
