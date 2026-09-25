"use client";

import { Info, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useSystemStore } from "@/store/system";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { playTone } from "@/lib/audio";
import WaveMark from "@/components/visual/WaveMark";

function AboutExperience({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);
  return <div className="entry-modal-backdrop" onClick={onClose}>
    <div className="entry-info-dialog" role="dialog" aria-modal="true" aria-labelledby="experience-title" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="entry-icon-button entry-info-close" aria-label="Close information" onClick={onClose}><X size={18} /></button>
      <WaveMark /><h2 id="experience-title">Beneath the interface.</h2>
      <p>A short, interactive lesson about the systems that make a computer usable. Enter the workstation, explore WaveOS, then open Operating Systems.</p>
      <p>WaveOS is a fictional teaching environment. Its files, processes, and resource usage are simulated entirely in your browser.</p>
      <div className="entry-info-keys"><span><kbd>→</kbd> <kbd>Space</kbd> Next scene</span><span><kbd>Esc</kbd> Return to desktop</span><span><kbd>M</kbd> Sound · <kbd>P</kbd> Pause motion</span></div>
      <h3>Design & credits</h3>
      <p>Workstation, camera choreography, screen framing, and outer interface adapted from <a href="https://github.com/henryjeff/portfolio-website" target="_blank" rel="noreferrer">Henry Heffernan’s portfolio</a> under the MIT license. Computer model by Mickael Boitte; environment models by Sean Nicolas; textures by Henry Heffernan. Desktop informed by the <a href="https://developer.gnome.org/hig/" target="_blank" rel="noreferrer">GNOME HIG</a>. Lesson geometry inspired by Sonic Wave Infinity’s ending sequence. Lesson artwork is original; no game assets or music are included.</p>
      <p className="entry-info-small">IBM Plex fonts · Lucide icons · <a href="/licenses.txt" target="_blank" rel="noreferrer">Licenses & acknowledgments</a></p>
    </div>
  </div>;
}

export default function StartGate({ onStart, onSkip, ready = true }: { onStart: () => void; onSkip: () => void; ready?: boolean }) {
  const muted = useSystemStore((s) => s.muted);
  const reducedMotion = useSystemStore((s) => s.reducedMotion);
  const [info, setInfo] = useState(false);
  const closeInfo = useCallback(() => setInfo(false), []);
  return <div className="entry-shell">
    <section className="entry-center" aria-labelledby="entry-title">
      <div className="entry-dialog">
        <h1 id="entry-title">Operating Systems · WaveOS</h1>
        <p>Interactive learning session</p>
        <p className="entry-status" role="status">{ready ? "Click start to begin" : "Loading workstation…"} <span className="computer-cursor" aria-hidden="true" /></p>
        <button className="entry-start" onClick={onStart} disabled={!ready} autoFocus>START</button>
      </div>
      <button className="entry-skip" onClick={onSkip}>Straight to the desktop ↗</button>
    </section>
    <footer className="entry-footer">
      <button onClick={() => setInfo(true)}><Info size={15} />About this experience</button>
      <div className="entry-preferences"><button className="entry-motion-control" onClick={() => useSystemStore.getState().setReducedMotion(!reducedMotion)} aria-pressed={reducedMotion}><span className={`entry-switch ${reducedMotion ? "is-on" : ""}`} />Reduce motion</button><button className="entry-sound" aria-label={muted ? "Enable sound" : "Mute sound"} title={muted ? "Sound off" : "Sound on"} onClick={() => { useSystemStore.getState().setMuted(!muted); if (muted) playTone(); }}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button></div>
    </footer>
    {info && <AboutExperience onClose={closeInfo} />}
  </div>;
}
