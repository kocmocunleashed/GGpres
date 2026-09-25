'use client';

import { ArrowRight, Monitor, Terminal } from 'lucide-react';
import type { LessonScene } from '@/lib/lesson-data';
import { useSystemStore } from '@/store/system';
import Diagrams, { FaultDiagram } from './Diagrams';
import { Diamond } from './LessonWorld';

function SceneTitle({ scene }: { scene: LessonScene }) {
  return <h1 id="lesson-scene-title" className="lw-scene-title">{scene.title.split('\n').map((line, index) => <span key={`${scene.id}-${index}`}>{line}</span>)}</h1>;
}

function Compare({ kind }: { kind: LessonScene['compare'] }) {
  if (kind === 'interfaces') return <div className="ld-compare ld-compare-interfaces"><div><Monitor /><h3>Graphical interface</h3><p>Recognize. Point. Click.</p><div className="ld-mini-files"><span>Documents</span><span>notes.txt</span></div><small>Visual and discoverable.</small></div><div><Terminal /><h3>Command-line interface</h3><p>Type. Compose. Automate.</p><code><span>$</span> cat Documents/notes.txt</code><small>Precise and repeatable.</small></div></div>;
  if (kind === 'fedora') return <div className="ld-name-layers"><div><span>FEDORA</span><strong>The distribution</strong><p>Packages, updates, integration, and defaults.</p></div><div><span>LINUX</span><strong>The kernel</strong><p>The core managing resources and hardware access.</p></div><div><span>GNOME</span><strong>The desktop</strong><p>The graphical environment you interact with.</p></div></div>;
  return <div className="ld-family-table"><div className="ld-family-row ld-family-head"><span>EXAMPLE</span><span>KERNEL FAMILY</span><span>FAMILIAR CONTEXT</span></div><div className="ld-family-row"><strong>Windows</strong><span>Windows NT</span><span>PCs, work, games</span></div><div className="ld-family-row"><strong>macOS</strong><span>XNU / Darwin</span><span>Apple Mac computers</span></div><div className="ld-family-row"><strong>Fedora</strong><span>Linux</span><span>A Linux distribution</span></div><p>Different implementations. Many of the same underlying ideas.</p></div>;
}

export default function SceneRenderer({ scene, onComplete }: { scene: LessonScene; onComplete: () => void }) {
  async function launchDemo() {
    if (!scene.demoApp) return;
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {});
    const state = useSystemStore.getState();
    state.setLessonPresenting(false);
    state.openApp(scene.demoApp);
    state.notify('Live lesson demo', 'Explore the desktop, then return to Lesson and choose Resume.');
  }

  if (scene.type === 'chapter' || scene.type === 'final') return <section className={`lw-scene lw-chapter ${scene.type === 'final' ? 'lw-final' : ''}`} aria-labelledby="lesson-scene-title"><div className="lw-chapter-diamond"><Diamond /><span>{scene.chapter}</span></div><SceneTitle scene={scene} />{scene.subtitle && <p className="lw-chapter-subtitle">{scene.subtitle}</p>}{scene.body && <p className="lw-chapter-body">{scene.body}</p>}{scene.type === 'final' && <button className="lw-action" onClick={onComplete}>Return to the desktop <ArrowRight size={18} /></button>}<div className="lw-chapter-line" /></section>;

  if (scene.type === 'statement') return <section className={`lw-scene lw-statement ${scene.id === 'complexity' ? 'lw-statement-final' : ''}`} aria-labelledby="lesson-scene-title"><SceneTitle scene={scene} /><div className="lw-statement-bottom"><Diamond />{scene.subtitle && <small>{scene.subtitle}</small>}<p>{scene.body}</p></div><svg className="lw-giant-chevron" viewBox="0 0 200 500" fill="none" aria-hidden="true"><path d="M-80-50 180 250-80 550M-130-50 130 250-130 550" stroke="currentColor" strokeWidth="1.5" /></svg></section>;

  if (scene.type === 'demoBridge') return <section className="lw-scene lw-demo-bridge" aria-labelledby="lesson-scene-title"><div className="lw-demo-copy"><SceneTitle scene={scene} /><p className="lw-scene-description">{scene.body}</p><button className="lw-action" onClick={launchDemo}>{scene.demoLabel}<ArrowRight size={20} /></button><small className="lw-return-note">Your place in the lesson is saved.</small></div><div className="lw-demo-instructions"><div className="lw-demo-orbit"><Diamond /><span>LIVE<br />SYSTEM</span></div><ol>{scene.steps?.map(step => <li key={step}>{step}</li>)}</ol><p>This desktop uses a shared simulation.<br />These are not your device’s real processes.</p></div></section>;

  if (scene.type === 'fault') return <section className="lw-scene lw-fault" aria-labelledby="lesson-scene-title"><div><span className="lw-fault-status">EXCEPTION / 0x0E</span><SceneTitle scene={scene} /><p className="lw-scene-description">{scene.body}</p></div><FaultDiagram /></section>;

  return <section className={`lw-scene lw-technical lw-technical-${scene.diagram || scene.compare}`} aria-labelledby="lesson-scene-title"><div className="lw-technical-heading"><SceneTitle scene={scene} /><p className="lw-scene-description">{scene.body}</p></div><div className="lw-technical-content">{scene.type === 'diagram' && scene.diagram ? <Diagrams diagram={scene.diagram} /> : <Compare kind={scene.compare} />}</div></section>;
}
