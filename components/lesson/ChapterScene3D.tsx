"use client";

import dynamic from "next/dynamic";
import { useCallback, useId, useRef, useState } from "react";
import { ArrowRight, ContactRound, Cpu, FileImage, FileText, Folder, HardDrive, KeyRound, Layers, MemoryStick, Monitor, Package, Server, Shield, Terminal, UserRound, type LucideIcon } from "lucide-react";
import { LESSON_SCENES } from "@/lib/lesson-scenes";
import { sceneState, sceneWords, transitionScene, type SceneKind, type SceneLanguage, type SceneNode } from "@/lib/lesson-scene";
import "./chapter-scene-3d.css";

const SceneCanvas = dynamic(() => import("./scene3d/SceneCanvas"), { ssr: false });
const icons: Record<SceneKind, LucideIcon> = {
  app: Monitor, process: Monitor, cpu: Cpu, "cpu-core": Cpu, ram: MemoryStick, storage: HardDrive,
  "image-file": FileImage, "text-file": FileText, software: Layers, desktop: Monitor, computer: Monitor,
  terminal: Terminal, code: FileText, person: UserRound, server: Server,
  contacts: ContactRound, shield: Shield, key: KeyRound, package: Package, folder: Folder,
};

type Props = {
  chapter: number;
  language: SceneLanguage;
  paused: boolean;
  enabled?: boolean;
  onDemo?: (app: "files" | "terminal") => void;
};

function NodeFact({ node, language }: { node: SceneNode; language: SceneLanguage }) {
  const Icon = icons[node.kind];
  return <li className="scene3d-fact" data-node={node.id} data-kind={node.kind} data-content={node.content ?? "empty"} data-tone={node.tone ?? "normal"}>
    <Icon size={26} aria-hidden="true" />
    <div><strong>{sceneWords(node.label, language)}</strong>
      {node.status && <span>{sceneWords(node.status, language)}</span>}
      {node.detail && <p>{sceneWords(node.detail, language)}</p>}
      {node.ink && <pre>{sceneWords(node.ink, language)}</pre>}
    </div>
  </li>;
}

/** Geometry, accessible facts and controls all consume this one teaching state. */
export default function ChapterScene3D({ chapter, language, paused, enabled = true, onDemo }: Props) {
  const scene = LESSON_SCENES[Math.min(17, Math.max(1, chapter)) - 1];
  const [selection, setSelection] = useState({ chapter, id: scene.initial });
  const [unavailable, setUnavailable] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const state = sceneState(scene, selection.chapter === chapter ? selection.id : scene.initial);
  const showCanvas = enabled && !unavailable;
  const titleId = useId();
  const outcomeId = useId();
  const outcome = useRef<HTMLDivElement>(null);
  const fail = useCallback(() => { setUnavailable(true); setCanvasReady(false); }, []);
  const ready = useCallback(() => setCanvasReady(true), []);
  const w = (words: readonly [string, string]) => sceneWords(words, language);

  function act(action: string) {
    setSelection({ chapter, id: transitionScene(scene, state.id, action) });
    // Actions can replace their own button. Keep keyboard focus on the result.
    requestAnimationFrame(() => outcome.current?.focus({ preventScroll: true }));
  }

  return <figure className="chapter-scene-3d" data-chapter={chapter} data-state={state.id} data-renderer={showCanvas ? "3d" : "text"} data-paused={paused} aria-labelledby={titleId}>
    <div className="cs3d-heading"><h2 id={titleId}>{w(scene.title)}</h2><small>{language === "mn" ? "Туршиж үз" : "Try it"}</small></div>
    {showCanvas && <div className="cs3d-stage" aria-hidden="true" data-ready={canvasReady}>
      <SceneCanvas state={state} language={language} paused={paused} onUnavailable={fail} onReady={ready} />
    </div>}
    {unavailable && enabled && <p className="cs3d-fallback" role="status">{language === "mn" ? "3D харагдац ажиллахгүй байна. Энэ жишээг доорх товчоор үргэлжлүүлэн туршиж болно." : "3D is unavailable. You can still try the same example below."}<button onClick={() => { setUnavailable(false); setCanvasReady(false); }}>{language === "mn" ? "3D-г дахин оролдох" : "Retry 3D"}</button></p>}
    <div className={showCanvas && canvasReady ? "scene3d-facts is-sr-only" : "scene3d-facts"}>
      {state.container && <p className="scene3d-collection">{w(state.container)}</p>}
      <ul>{state.nodes.map(node => <NodeFact key={node.id} node={node} language={language} />)}</ul>
    </div>
    {showCanvas && canvasReady && state.nodes.some(node => node.detail || node.ink) && <dl className="scene3d-details">{state.nodes.filter(node => node.detail || node.ink).map(node => <div key={node.id}><dt>{w(node.label)}</dt><dd>{node.detail && <span>{w(node.detail)}</span>}{node.ink && <pre>{w(node.ink)}</pre>}</dd></div>)}</dl>}
    {!!state.relations?.length && <ul className="scene3d-relations" aria-label={language === "mn" ? "Холбоо" : "Relationships"}>
      {state.relations.map((relation, index) => <li key={`${relation.from}-${relation.to}-${index}`} data-relation={relation.kind}>
        <span>{w(state.nodes.find(node => node.id === relation.from)!.label)}</span><ArrowRight size={14} aria-hidden="true" /><span>{w(state.nodes.find(node => node.id === relation.to)!.label)}</span><small>{w(relation.label)}</small>
      </li>)}
    </ul>}
    <div className="scene3d-outcome" ref={outcome} id={outcomeId} tabIndex={-1} aria-live="polite" aria-atomic="true">
      <h3>{w(state.title)}</h3><p>{w(state.description)}</p>
    </div>
    <div className="scene3d-actions" role="group" aria-label={language === "mn" ? "Жишээг удирдах" : "Example controls"}>
      {state.actions.map(action => <button key={action.id} data-action={action.id} onClick={() => act(action.id)} aria-controls={outcomeId}>{w(action.label)}</button>)}
    </div>
    {chapter === 16 && onDemo && <div className="scene3d-demo"><button onClick={() => onDemo("files")}><Folder size={16} />{language === "mn" ? "Files-ийг нээх" : "Open Files"}</button><button onClick={() => onDemo("terminal")}><Terminal size={16} />{language === "mn" ? "Terminal-ийг нээх" : "Open Terminal"}</button></div>}
    <figcaption>{w(scene.summary)}</figcaption>
  </figure>;
}
