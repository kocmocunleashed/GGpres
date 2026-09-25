"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { isHostStateMessage, type DesktopMessage, type HostStateMessage } from "@/lib/desktop-bridge";
import { playTone } from "@/lib/audio";
import { useSystemStore } from "@/store/system";
import DesktopShell from "./DesktopShell";
import "./session.css";

const subscribeToEmbedding = () => () => {};
const getEmbedding = () => window.parent !== window;
const getServerEmbedding = () => false;

function postDesktopMessage(message: DesktopMessage) {
  if (window.parent !== window) window.parent.postMessage(message, window.location.origin);
}

/** One desktop instance lives for the lifetime of the same-origin screen frame. */
export default function DesktopSession() {
  const embedded = useSyncExternalStore(subscribeToEmbedding, getEmbedding, getServerEmbedding);
  const [host, setHost] = useState<HostStateMessage | null>(null);
  const [session, setSession] = useState(0);
  const activeRef = useRef(false);
  const hostRef = useRef<HostStateMessage | null>(null);
  const bootPlayed = useRef(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const lastMeaningfulFocus = useRef<HTMLElement | null>(null);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const motionPaused = useSystemStore((state) => state.motionPaused);
  const systemReducedMotion = useReducedMotion();
  const powered = !embedded || host?.powered !== false;
  const active = !embedded || host?.active === true && powered;

  useEffect(() => {
    const inFrame = window.parent !== window;
    activeRef.current = !inFrame;
    let applyingHostPreferences = false;
    let interruptedSession = false;
    const ownedEscapeEvents = new WeakSet<KeyboardEvent>();

    function isMeaningfulFocus(element: EventTarget | null): element is HTMLElement {
      return element instanceof HTMLElement && element !== document.body && element !== document.documentElement;
    }

    function trackFocus(event: FocusEvent) {
      if (activeRef.current && isMeaningfulFocus(event.target)) lastMeaningfulFocus.current = event.target;
    }

    function hasOpenOverlay() {
      return Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], dialog[open], :popover-open'))
        .some((element) => !element.closest('[hidden], [inert]') && element.getClientRects().length > 0);
    }

    function playBootOnce() {
      if (!activeRef.current || bootPlayed.current) return;
      bootPlayed.current = true;
      if (!useSystemStore.getState().muted) playTone("boot");
    }

    function receiveHostState(event: MessageEvent<unknown>) {
      if (!inFrame || event.source !== window.parent || event.origin !== window.location.origin || !isHostStateMessage(event.data)) return;
      const message = event.data;
      const nextActive = message.active && message.powered;
      const previousHost = hostRef.current;
      if (activeRef.current && !nextActive) {
        previousFocus.current = isMeaningfulFocus(document.activeElement) ? document.activeElement : lastMeaningfulFocus.current;
        if (isMeaningfulFocus(document.activeElement)) document.activeElement.blur();
      }
      activeRef.current = nextActive;
      hostRef.current = message;
      setHost((previous) => previous && previous.active === message.active && previous.expanded === message.expanded
        && previous.powered === message.powered && previous.canFrame === message.canFrame && previous.muted === message.muted && previous.reducedMotion === message.reducedMotion && previous.motionPaused === message.motionPaused ? previous : message);
      const state = useSystemStore.getState();
      if (previousHost?.powered && !message.powered) interruptedSession = true;
      if (!message.powered && state.lessonPresenting) state.setLessonPresenting(false);
      if (message.powered && interruptedSession) {
        interruptedSession = false;
        state.notify("Simulation resumed", "Power is back. This demo preserved your open apps.");
      }
      if (state.muted !== message.muted || state.reducedMotion !== message.reducedMotion || state.motionPaused !== message.motionPaused) {
        applyingHostPreferences = true;
        useSystemStore.setState({ muted: message.muted, reducedMotion: message.reducedMotion, motionPaused: message.motionPaused });
        applyingHostPreferences = false;
      }
      playBootOnce();
    }

    function blockInactiveKeyboard(event: KeyboardEvent) {
      if (event.type === "keydown" && event.key === "Escape") {
        const editable = event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
        if (useSystemStore.getState().lessonPresenting || editable || hasOpenOverlay()) ownedEscapeEvents.add(event);
      }
      if (!inFrame || activeRef.current) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function forwardUnhandledEscape(event: KeyboardEvent) {
      if (!inFrame || event.key !== "Escape" || event.repeat || ownedEscapeEvents.has(event)) return;
      // Let app and lesson handlers finish before treating Escape as camera navigation.
      queueMicrotask(() => {
        if (event.defaultPrevented || !activeRef.current || !hostRef.current?.canFrame || hostRef.current.expanded || useSystemStore.getState().lessonPresenting) return;
        postDesktopMessage({ source: "waveos-desktop", type: "view", action: "desk" });
      });
    }

    const unsubscribe = useSystemStore.subscribe((state, previous) => {
      if (state.lessonPresenting !== previous.lessonPresenting) {
        postDesktopMessage({ source: "waveos-desktop", type: "presentation", active: state.lessonPresenting });
      }
      if (!applyingHostPreferences && (state.muted !== previous.muted || state.reducedMotion !== previous.reducedMotion || state.motionPaused !== previous.motionPaused)) {
        postDesktopMessage({ source: "waveos-desktop", type: "preferences", muted: state.muted, reducedMotion: state.reducedMotion, motionPaused: state.motionPaused });
      }
      if (!activeRef.current || state.muted || applyingHostPreferences) return;
      if (state.lessonIndex !== previous.lessonIndex && state.lessonPresenting) playTone("scene");
      else if (state.windows.length > previous.windows.length) playTone("open");
    });

    window.addEventListener("message", receiveHostState);
    window.addEventListener("focusin", trackFocus);
    window.addEventListener("keydown", blockInactiveKeyboard, true);
    window.addEventListener("keyup", blockInactiveKeyboard, true);
    window.addEventListener("keydown", forwardUnhandledEscape);
    postDesktopMessage({ source: "waveos-desktop", type: "ready" });
    playBootOnce();
    return () => {
      unsubscribe();
      window.removeEventListener("message", receiveHostState);
      window.removeEventListener("focusin", trackFocus);
      window.removeEventListener("keydown", blockInactiveKeyboard, true);
      window.removeEventListener("keyup", blockInactiveKeyboard, true);
      window.removeEventListener("keydown", forwardUnhandledEscape);
    };
  }, []);

  useEffect(() => {
    if (active && previousFocus.current?.isConnected) {
      previousFocus.current.focus({ preventScroll: true });
      previousFocus.current = null;
    }
  }, [active]);

  const restart = useCallback(() => {
    postDesktopMessage({ source: "waveos-desktop", type: "restart" });
    useSystemStore.getState().resetSession();
    setSession((value) => value + 1);
    bootPlayed.current = false;
    if (window.parent === window && !useSystemStore.getState().muted) playTone("boot");
  }, []);

  const backToDesk = useCallback(() => postDesktopMessage({ source: "waveos-desktop", type: "view", action: "desk" }), []);
  const toggleExpanded = useCallback(() => postDesktopMessage({ source: "waveos-desktop", type: "view", action: host?.expanded ? "frame" : "expand" }), [host?.expanded]);

  return <main className="desktop-session" inert={!active} data-active={active} data-powered={powered} data-reduced-motion={reducedMotion || !!systemReducedMotion} data-motion-paused={motionPaused}>
    <DesktopShell key={session} active={active} onRestart={restart} onBackToDesk={embedded && host?.canFrame ? backToDesk : undefined} onToggleExpanded={embedded && host?.canFrame ? toggleExpanded : undefined} expanded={host?.expanded ?? false} />
  </main>;
}
