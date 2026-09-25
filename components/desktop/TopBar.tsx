import { Accessibility, BatteryFull, Check, ChevronDown, CircleHelp, Expand, LogOut, Minimize2, Monitor, Settings, Volume2, VolumeX, Wifi, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSystemStore } from "@/store/system";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { playTone } from "@/lib/audio";

type ViewActions = { onBackToDesk?: () => void; onToggleExpanded?: () => void; expanded?: boolean };

function StatusPanel({ onClose, onRestart, onBackToDesk, onToggleExpanded, expanded }: { onClose: () => void; onRestart: () => void } & ViewActions) {
  const ref = useRef<HTMLDivElement>(null);
  const muted = useSystemStore((s) => s.muted);
  const reducedMotion = useSystemStore((s) => s.reducedMotion);
  useDialogFocus(ref, onClose);
  return <div className="desktop-popover desktop-status" ref={ref} role="dialog" aria-label="Quick settings">
    <div className="desktop-popover-heading"><span>student</span><span><BatteryFull size={17} /> 100%</span></div>
    <div className="desktop-quick-grid">
      <button aria-pressed={!muted} className={!muted ? "is-on" : ""} onClick={() => { useSystemStore.getState().setMuted(!muted); if (muted) playTone(); }}>{muted ? <VolumeX size={21} /> : <Volume2 size={21} />}<span>Sound<small>{muted ? "Off" : "On"}</small></span>{!muted && <Check size={14} />}</button>
      <button aria-pressed={reducedMotion} className={reducedMotion ? "is-on" : ""} onClick={() => useSystemStore.getState().setReducedMotion(!reducedMotion)}><Accessibility size={21} /><span>Reduce motion<small>{reducedMotion ? "On" : "Off"}</small></span>{reducedMotion && <Check size={14} />}</button>
    </div>
    <div className="desktop-network-info"><Wifi size={17} /><span>opitlcalOS Classroom<small>Virtual connection · works locally</small></span></div>
    <div className="desktop-status-actions">
      {onToggleExpanded && <button onClick={() => { onClose(); onToggleExpanded(); }}>{expanded ? <Minimize2 size={17} /> : <Expand size={17} />}{expanded ? "Return to monitor" : "Expand desktop"}</button>}
      {onBackToDesk && <button onClick={() => { onClose(); onBackToDesk(); }}><Monitor size={17} />Back to desk</button>}
      <button onClick={() => { useSystemStore.getState().openApp("settings"); onClose(); }}><Settings size={17} />Settings</button><button onClick={() => { useSystemStore.getState().openApp("about"); onClose(); }}><CircleHelp size={17} />About opitlcalOS</button><button onClick={onRestart}><LogOut size={17} />Restart experience</button>
    </div>
  </div>;
}

function CalendarPanel({ date, onClose }: { date: Date; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useSystemStore((s) => s.notifications);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  useDialogFocus(ref, onClose);
  return <div className="desktop-popover desktop-calendar" role="dialog" aria-label="Date and notifications" ref={ref}>
    <div className="desktop-popover-heading"><span>{date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span><button onClick={onClose} aria-label="Close calendar"><X size={15} /></button></div>
    <div className="desktop-calendar-grid">{["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <span key={`heading-${i}`} className="day-name">{day}</span>)}{Array.from({ length: firstDay }, (_, i) => <span key={`blank-${i}`} />)}{Array.from({ length: days }, (_, i) => <span key={i} className={i + 1 === date.getDate() ? "is-today" : ""} aria-current={i + 1 === date.getDate() ? "date" : undefined}>{i + 1}</span>)}</div>
    <div className="desktop-notification-heading"><strong>Notifications</strong>{notifications.length > 0 && <button onClick={() => notifications.forEach((n) => useSystemStore.getState().dismissNotification(n.id))}>Clear all</button>}</div>
    <div className="desktop-notification-list">{notifications.length ? [...notifications].reverse().map((notification) => <div key={notification.id}><strong>{notification.title}</strong><p>{notification.message}</p></div>) : <p className="desktop-no-notifications">You’re all caught up.</p>}</div>
  </div>;
}

export default function TopBar({ overview, onActivities, onRestart, onBackToDesk, onToggleExpanded, expanded }: { overview: boolean; onActivities: () => void; onRestart: () => void } & ViewActions) {
  const [date, setDate] = useState(() => new Date());
  const [panel, setPanel] = useState<"status" | "calendar" | null>(null);
  const muted = useSystemStore((s) => s.muted);
  const notifications = useSystemStore((s) => s.notifications);
  const closePanel = useCallback(() => setPanel(null), []);
  useEffect(() => { const timer = setInterval(() => setDate(new Date()), 1000); return () => clearInterval(timer); }, []);
  return <>
    <header className="desktop-topbar">
      <button className={`desktop-activities-button ${overview ? "is-active" : ""}`} onClick={() => { setPanel(null); onActivities(); }} aria-expanded={overview}><span className="desktop-activities-symbol"><i /><i /></span>Activities</button>
      <button className="desktop-clock" onClick={() => setPanel(panel === "calendar" ? null : "calendar")} aria-expanded={panel === "calendar"} aria-label="Date and notifications" suppressHydrationWarning>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}<span suppressHydrationWarning>{date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>{notifications.length > 0 && <i />}</button>
      <button className="desktop-status-button" aria-label="Open quick settings" aria-expanded={panel === "status"} onClick={() => setPanel(panel === "status" ? null : "status")}><Wifi size={15} />{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}<BatteryFull size={18} /><ChevronDown size={11} /></button>
    </header>
    {panel && <><button className="desktop-popover-backdrop" onClick={closePanel} aria-label="Close popover" tabIndex={-1} />{panel === "status" ? <StatusPanel onClose={closePanel} onRestart={onRestart} onBackToDesk={onBackToDesk} onToggleExpanded={onToggleExpanded} expanded={expanded} /> : <CalendarPanel date={date} onClose={closePanel} />}</>}
  </>;
}
