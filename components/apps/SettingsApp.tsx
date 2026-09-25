"use client";

import { Check, Monitor, Moon, Volume2, Waves, Wind } from "lucide-react";
import { useSystemStore } from "@/store/system";

export function SettingsApp() {
  const muted = useSystemStore((state) => state.muted);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const motionPaused = useSystemStore((state) => state.motionPaused);
  const wallpaper = useSystemStore((state) => state.wallpaper);
  const setMuted = useSystemStore((state) => state.setMuted);
  const setReducedMotion = useSystemStore((state) => state.setReducedMotion);
  const setMotionPaused = useSystemStore((state) => state.setMotionPaused);
  const setWallpaper = useSystemStore((state) => state.setWallpaper);
  return <div className="app-settings app-scroll-content">
    <div className="app-content-heading"><h2>Your space, your pace.</h2><p>A few comforts for a better learning session.</p></div>
    <section className="app-settings-section"><h3>Comfort & accessibility</h3><div className="app-settings-group">
      <div className="app-setting-row"><span className="app-setting-icon"><Wind size={22} /></span><div><strong>Reduce motion</strong><p>Gentler transitions throughout the workstation.</p></div><button type="button" role="switch" aria-checked={reducedMotion} aria-label="Reduce motion" className="app-switch" onClick={() => setReducedMotion(!reducedMotion)}><span /></button></div>
      <div className="app-setting-row"><span className="app-setting-icon"><Moon size={21} /></span><div><strong>Pause ambient motion</strong><p>Keep lesson particles and background geometry still.</p></div><button type="button" role="switch" aria-checked={motionPaused} aria-label="Pause ambient motion" className="app-switch" onClick={() => setMotionPaused(!motionPaused)}><span /></button></div>
      <div className="app-setting-row"><span className="app-setting-icon"><Volume2 size={21} /></span><div><strong>Sound</strong><p>Optional audio. Everything works quietly, too.</p></div><button type="button" role="switch" aria-checked={!muted} aria-label="Sound" className="app-switch" onClick={() => setMuted(!muted)}><span /></button></div>
    </div></section>
    <section className="app-settings-section"><h3>Appearance</h3><div className="app-wallpaper-options">{(["wave", "dusk"] as const).map((value) => <button key={value} className={`app-wallpaper-option ${wallpaper === value ? "is-selected" : ""}`} aria-pressed={wallpaper === value} onClick={() => setWallpaper(value)}><span className={`app-wallpaper-preview app-wallpaper-${value}`}><span />{wallpaper === value && <Check size={19} />}</span><span>{value === "wave" ? "Blue current" : "After hours"}</span></button>)}</div></section>
    <div className="app-settings-note"><Monitor size={17} /><p>Made for a classroom screen. Press <kbd>Esc</kbd> during the lesson to return to your desktop.</p></div>
    <div className="app-settings-brand"><Waves size={18} /> WaveOS · Classroom edition</div>
  </div>;
}
export default SettingsApp;
