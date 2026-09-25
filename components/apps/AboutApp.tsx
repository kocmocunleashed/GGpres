"use client";

import { ArrowUpRight } from "lucide-react";
import WaveMark from "@/components/visual/WaveMark";

export function AboutApp() {
  return <div className="app-about app-scroll-content">
    <div className="app-about-logo"><WaveMark /></div><h2>opitlcalOS</h2><p className="app-about-version">1.0 · Classroom edition</p><p className="app-about-motto">A familiar surface.<br />A world underneath.</p>
    <dl className="app-about-specs"><div><dt>System</dt><dd>Fictional educational distribution</dd></div><div><dt>Kernel model</dt><dd>Linux 6.12 · simulated</dd></div><div><dt>Desktop</dt><dd>opitlcal Shell · GNOME-inspired</dd></div><div><dt>Memory</dt><dd>8 GiB · virtual</dd></div></dl>
    <p className="app-about-disclaimer">An interactive model of an operating system, running in your browser. Process, memory, and file activity are simulated. opitlcalOS is not affiliated with Fedora or GNOME.</p>
    <a className="app-about-link" href="https://fedoraproject.org/workstation/" target="_blank" rel="noreferrer">Meet a real Linux desktop<ArrowUpRight size={16} /></a>
    <p className="app-about-easter-egg">Built with curiosity. Powered by a completely reasonable number of diamonds.</p>
  </div>;
}
export default AboutApp;
