"use client";

import { useEffect, useState } from "react";
import WaveMark from "@/components/visual/WaveMark";

const steps = ["Initializing display", "Loading system services", "Starting your session"];

export default function BootSequence({ onComplete, reducedMotion }: { onComplete: () => void; reducedMotion: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setStep((current) => Math.min(2, current + 1)), 360);
    const complete = setTimeout(onComplete, reducedMotion ? 180 : 1200);
    return () => { clearInterval(interval); clearTimeout(complete); };
  }, [onComplete, reducedMotion]);
  return <div className="boot-screen" role="status" aria-live="polite"><WaveMark /><span className="boot-brand">wave<span>OS</span></span><div className="boot-progress"><span style={{ width: `${(step + 1) / 3 * 100}%` }} /></div><p>{steps[step]}<span aria-hidden="true">…</span></p><small>LEARNING EDITION</small></div>;
}
