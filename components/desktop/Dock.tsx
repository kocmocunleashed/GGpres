import { Grid2X2 } from "lucide-react";
import { useSystemStore, type AppId } from "@/store/system";
import AppIcon from "./AppIcon";

const apps: { id: AppId; label: string }[] = [{ id: "lesson", label: "Operating Systems" }, { id: "files", label: "Files" }, { id: "terminal", label: "Terminal" }, { id: "runner", label: "Dino Runner" }, { id: "system-monitor", label: "System Monitor" }, { id: "software", label: "Software" }, { id: "settings", label: "Settings" }];

export default function Dock({ onActivities, overview }: { onActivities: () => void; overview: boolean }) {
  const windows = useSystemStore((s) => s.windows);
  const focus = windows.filter((w) => !w.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]?.appId;
  return <nav className="desktop-dock" aria-label="Applications">
    {apps.map(({ id, label }) => <button key={id} className={`desktop-dock-item ${focus === id ? "is-focused" : ""}`} aria-label={`Open ${label}`} onClick={() => { useSystemStore.getState().openApp(id); if (overview) onActivities(); }}>
      <span className="desktop-dock-tooltip">{label}</span><AppIcon appId={id} /><span className={`desktop-dock-indicator ${windows.some((w) => w.appId === id) ? "is-running" : ""}`} />
    </button>)}
    <span className="desktop-dock-divider" />
    <button className={`desktop-dock-item desktop-dock-launcher ${overview ? "is-focused" : ""}`} onClick={onActivities} aria-label="Show applications" aria-expanded={overview}><span className="desktop-dock-tooltip">Show applications</span><Grid2X2 size={25} strokeWidth={1.8} /></button>
  </nav>;
}
