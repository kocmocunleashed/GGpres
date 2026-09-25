'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, Grid2X2, Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { lessonChapters, lessonScenes } from '@/lib/lesson-data';
import { useSystemStore } from '@/store/system';
import LessonWorld from './LessonWorld';
import SceneRenderer from './SceneRenderer';
import './lesson.css';

export default function LessonEngine() {
  const index = useSystemStore(state => state.lessonIndex);
  const muted = useSystemStore(state => state.muted);
  const motionPaused = useSystemStore(state => state.motionPaused);
  const reducedMotion = useSystemStore(state => state.reducedMotion);
  const systemReducedMotion = useReducedMotion();
  const [reset, setReset] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [overview, setOverview] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const keepLessonOnFullscreenExit = useRef(false);
  const chapterDialog = useRef<HTMLDialogElement>(null);
  const safeIndex = Math.max(0, Math.min(index, lessonScenes.length - 1));
  const scene = lessonScenes[safeIndex];
  const chapter = lessonChapters.find(item => item.number === scene.chapter);

  const leave = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    useSystemStore.getState().setLessonPresenting(false);
  }, []);

  const complete = useCallback(() => {
    useSystemStore.getState().setLessonComplete(true);
    leave();
  }, [leave]);

  const goTo = useCallback((next: number) => {
    const state = useSystemStore.getState();
    setDirection(next < state.lessonIndex ? 'backward' : 'forward');
    state.setLessonIndex(Math.max(0, Math.min(lessonScenes.length - 1, next)));
    state.setLessonComplete(next >= lessonScenes.length - 1);
  }, []);

  useEffect(() => {
    rootRef.current?.focus();
    let ownsFullscreen = document.fullscreenElement === rootRef.current;
    function onFullscreenChange() {
      const isFullscreen = document.fullscreenElement === rootRef.current;
      const exitedLessonFullscreen = ownsFullscreen && !isFullscreen;
      ownsFullscreen = isFullscreen;
      if (!exitedLessonFullscreen) return;
      // Browsers can consume Escape before delivering a keydown to the page.
      // Only the explicit fullscreen toggle keeps the presentation open.
      if (!keepLessonOnFullscreenExit.current) useSystemStore.getState().setLessonPresenting(false);
      keepLessonOnFullscreenExit.current = false;
    }
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (chapterDialog.current?.open) return;
      const state = useSystemStore.getState();
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        setReset(value => value + 1);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        leave();
      } else if (event.key === 'ArrowRight' || (event.code === 'Space' && target.tagName !== 'BUTTON')) {
        event.preventDefault();
        if (state.lessonIndex >= lessonScenes.length - 1) complete();
        else goTo(state.lessonIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(state.lessonIndex - 1);
      } else if (event.key.toLowerCase() === 'm') {
        state.setMuted(!state.muted);
      } else if (event.key.toLowerCase() === 'p') {
        state.setMotionPaused(!state.motionPaused);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [complete, goTo, leave]);

  function toggleOverview() {
    if (chapterDialog.current?.open) chapterDialog.current.close();
    else chapterDialog.current?.showModal();
    setOverview(Boolean(chapterDialog.current?.open));
  }

  function selectChapter(number: string) {
    goTo(lessonScenes.findIndex(item => item.chapter === number));
    chapterDialog.current?.close();
    setOverview(false);
  }

  async function fullscreen() {
    try {
      if (document.fullscreenElement) {
        keepLessonOnFullscreenExit.current = document.fullscreenElement === rootRef.current;
        await document.exitFullscreen();
      }
      else await rootRef.current?.requestFullscreen();
    } catch {
      keepLessonOnFullscreenExit.current = false;
      useSystemStore.getState().notify('Presentation view', 'Your browser is already showing the full lesson. Browser fullscreen is unavailable.');
    }
  }

  return <div ref={rootRef} tabIndex={-1} className={`lw-engine ${reducedMotion || systemReducedMotion ? 'lw-reduced-motion' : ''} ${motionPaused ? 'lw-motion-paused' : ''}`} data-scene-type={scene.type} aria-label="Operating systems interactive lesson">
    <LessonWorld />
    <header className="lw-header"><button className="lw-wordmark" onClick={leave} aria-label="Return to WaveOS desktop"><svg width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true"><path d="m1 4 5 12 5-12 5 12 5-12" stroke="currentColor" strokeWidth="1.5" /></svg><span>WAVEOS <b>/</b> LESSON</span></button><div className="lw-chapter-meta"><span>{scene.chapter}</span><span>{chapter?.title}</span></div><button className="lw-icon-button" onClick={leave} aria-label="Exit lesson to desktop (Escape)" title="Return to desktop · Esc"><X size={21} /></button></header>
    <div className={`lw-scene-layer lw-direction-${direction}`} key={`${scene.id}-${reset}`} tabIndex={0} role="group" aria-label="Current lesson scene"><SceneRenderer scene={scene} onComplete={complete} /></div>
    <footer className="lw-footer"><div className="lw-footer-left"><button className={`lw-icon-button ${overview ? 'is-active' : ''}`} onClick={toggleOverview} aria-label="Open chapter overview" title="Chapters"><Grid2X2 size={18} /></button><span className="lw-footer-caption">{scene.type === 'demoBridge' ? 'LEARN BY DOING' : 'BENEATH THE SURFACE'}</span></div><div className="lw-navigation"><button onClick={() => goTo(safeIndex - 1)} disabled={safeIndex === 0} aria-label="Previous scene"><ArrowLeft size={20} /></button><span aria-live="polite"><strong>{String(safeIndex + 1).padStart(2, '0')}</strong><i>/</i>{String(lessonScenes.length).padStart(2, '0')}</span><button onClick={() => safeIndex === lessonScenes.length - 1 ? complete() : goTo(safeIndex + 1)} aria-label={safeIndex === lessonScenes.length - 1 ? 'Finish lesson and return to desktop' : 'Next scene'}><ArrowRight size={20} /></button></div><div className="lw-footer-right"><button className="lw-icon-button lw-reset-button" onClick={() => setReset(value => value + 1)} aria-label="Reset current scene" title="Reset scene · Ctrl/⌘ Shift R"><RotateCcw size={16} /></button><button className="lw-icon-button" onClick={() => useSystemStore.getState().setMotionPaused(!motionPaused)} aria-label={motionPaused ? 'Resume motion (P)' : 'Pause motion (P)'} title={motionPaused ? 'Resume motion · P' : 'Pause motion · P'} aria-pressed={motionPaused}>{motionPaused ? <Play size={17} /> : <Pause size={17} />}</button><button className="lw-icon-button" onClick={() => useSystemStore.getState().setMuted(!muted)} aria-label={muted ? 'Unmute (M)' : 'Mute (M)'} title={muted ? 'Unmute · M' : 'Mute · M'} aria-pressed={muted}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><button className="lw-icon-button lw-fullscreen-button" onClick={fullscreen} aria-label="Toggle browser fullscreen" title="Toggle fullscreen"><Expand size={17} /></button></div></footer>
    <div className="lw-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(safeIndex + 1) / lessonScenes.length})` }} /></div>
    <dialog ref={chapterDialog} className="lw-chapter-dialog" onClose={() => setOverview(false)}><div className="lw-dialog-heading"><h2>Your journey</h2><button className="lw-icon-button" onClick={toggleOverview} aria-label="Close chapter overview"><X size={20} /></button></div><div className="lw-chapter-list">{lessonChapters.map(item => <button key={item.number} className={scene.chapter === item.number ? 'is-current' : ''} onClick={() => selectChapter(item.number)}><span>{item.number}</span>{item.title}<ArrowRight size={16} /></button>)}</div><p>← → Navigate · Esc Desktop · P Pause motion · M Mute</p></dialog>
  </div>;
}
