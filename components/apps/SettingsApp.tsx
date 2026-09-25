"use client";

import { Check, Monitor, Moon, Volume2, Wind } from "lucide-react";
import WaveMark from "@/components/visual/WaveMark";
import { useSystemStore } from "@/store/system";

const themes = [
  { id: "wave", name: "Original", description: "A familiar blue current" },
  { id: "monochrome", name: "Monochrome", description: "Charcoal, silver, and white" },
  { id: "pink", name: "Bubbly Pink", description: "Soft shapes, a rosy outlook" },
] as const;

export function SettingsApp() {
  const theme = useSystemStore((state) => state.theme);
  const setTheme = useSystemStore((state) => state.setTheme);
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
    <fieldset className="app-theme-picker"><legend>Desktop theme</legend><div className="app-theme-options">{themes.map(({ id, name, description }) => <label className="app-theme-option" key={id}>
      <input type="radio" name="desktop-theme" value={id} checked={theme === id} onChange={() => setTheme(id)} aria-label={name} />
      <span className={`app-theme-preview app-theme-preview-${id}`} aria-hidden="true"><span className="app-theme-mini-bar" /><span className="app-theme-mini-window"><i /><i /><i /></span><span className="app-theme-mini-dock"><i /><i /><i /></span><span className="app-theme-selected"><Check size={13} /></span></span>
      <span className="app-theme-name">{name}</span><span className="app-theme-description">{description}</span>
    </label>)}</div><p className="app-theme-caption">Window colors, app controls, and wallpaper change together.</p></fieldset>
    {theme === "wave" && <section className="app-settings-section app-wallpaper-section"><h3>Wallpaper</h3><div className="app-wallpaper-options">{(["wave", "dusk"] as const).map((value) => <button type="button" key={value} className={`app-wallpaper-option ${wallpaper === value ? "is-selected" : ""}`} aria-pressed={wallpaper === value} onClick={() => setWallpaper(value)}><span className={`app-wallpaper-preview app-wallpaper-${value}`}><span />{wallpaper === value && <Check size={19} />}</span><span>{value === "wave" ? "Blue current" : "After hours"}</span></button>)}</div></section>}
    <section className="app-settings-section"><h3>Comfort & accessibility</h3><div className="app-settings-group">
      <div className="app-setting-row"><span className="app-setting-icon"><Wind size={22} /></span><div><strong>Reduce motion</strong><p>Gentler transitions throughout the workstation.</p></div><button type="button" role="switch" aria-checked={reducedMotion} aria-label="Reduce motion" className="app-switch" onClick={() => setReducedMotion(!reducedMotion)}><span /></button></div>
      <div className="app-setting-row"><span className="app-setting-icon"><Moon size={21} /></span><div><strong>Pause ambient motion</strong><p>Keep lesson particles and background geometry still.</p></div><button type="button" role="switch" aria-checked={motionPaused} aria-label="Pause ambient motion" className="app-switch" onClick={() => setMotionPaused(!motionPaused)}><span /></button></div>
      <div className="app-setting-row"><span className="app-setting-icon"><Volume2 size={21} /></span><div><strong>Sound</strong><p>Optional audio. Everything works quietly, too.</p></div><button type="button" role="switch" aria-checked={!muted} aria-label="Sound" className="app-switch" onClick={() => setMuted(!muted)}><span /></button></div>
    </div></section>
    <div className="app-settings-note"><Monitor size={17} /><p>Made for a classroom screen. Press <kbd>Esc</kbd> during the lesson to return to your desktop.</p></div>
    <div className="app-settings-brand"><WaveMark /> opitlcalOS · Classroom edition</div>
  </div>;
}
export default SettingsApp;
