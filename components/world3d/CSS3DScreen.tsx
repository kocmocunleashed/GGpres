"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { PerspectiveCamera, Scene } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { isDesktopMessage, type DesktopMessage, type HostStateMessage, type WorkstationView } from "@/lib/desktop-bridge";

export type ScreenProjection = { render: (camera: PerspectiveCamera) => void };

interface Props {
  projectionRef: RefObject<ScreenProjection | null>;
  view: WorkstationView;
  powered: boolean;
  expanded: boolean;
  canFrame: boolean;
  muted: boolean;
  reducedMotion: boolean;
  motionPaused: boolean;
  onReady: () => void;
  onViewChange: (view: WorkstationView) => void;
  onDesktopMessage: (message: DesktopMessage) => void;
}

/** The iframe and its DOM parents are constructed once. Projection/expansion
 * changes only CSS, so returning to the desk never reloads the GNOME session. */
export default function CSS3DScreen(props: Props) {
  const { projectionRef } = props;
  const container = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const objectRef = useRef<HTMLElement | null>(null);
  const latest = useRef(props);

  useLayoutEffect(() => {
    latest.current = props;
  });

  useEffect(() => {
    const mount = container.current;
    if (!mount) return;
    const renderer = new CSS3DRenderer();
    const scene = new Scene();
    renderer.domElement.className = "world-screen-renderer";
    const viewElement = renderer.domElement.firstElementChild as HTMLElement;
    viewElement.classList.add("world-screen-view");
    viewElement.firstElementChild?.classList.add("world-screen-camera");
    mount.appendChild(renderer.domElement);

    const element = document.createElement("div");
    element.className = "world-screen-object";
    element.style.width = "1280px";
    element.style.height = "1024px";
    const iframe = document.createElement("iframe");
    iframe.className = "world-desktop-frame";
    iframe.title = "opitlcalOS desktop";
    iframe.allow = "fullscreen; autoplay";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "same-origin");
    iframe.setAttribute("frameborder", "0");
    iframe.style.width = "1280px";
    iframe.style.height = "1024px";
    iframe.tabIndex = -1;
    iframe.inert = true;
    element.appendChild(iframe);
    iframeRef.current = iframe;
    objectRef.current = element;

    const object = new CSS3DObject(element);
    object.position.set(0, 950 / 900, 255 / 900);
    object.rotation.x = -Math.PI / 60;
    object.scale.setScalar(1 / 900);
    scene.add(object);
    let lastCamera: PerspectiveCamera | null = null;

    function state(): HostStateMessage {
      const current = latest.current;
      return { source: "opitlcalos-host", type: "state", active: current.powered && current.view !== "loading" && (current.view === "monitor" || current.expanded), powered: current.powered, expanded: current.expanded, canFrame: current.canFrame, muted: current.muted, reducedMotion: current.reducedMotion, motionPaused: current.motionPaused };
    }
    function sendState() { iframe.contentWindow?.postMessage(state(), window.location.origin); }
    function resize() {
      const rect = mount!.getBoundingClientRect();
      renderer.setSize(rect.width || window.innerWidth, rect.height || window.innerHeight);
      if (lastCamera && !latest.current.expanded) renderer.render(scene, lastCamera);
    }
    function message(event: MessageEvent<unknown>) {
      if (event.origin !== window.location.origin || event.source !== iframe.contentWindow || !isDesktopMessage(event.data)) return;
      if (event.data.type === "ready") { sendState(); latest.current.onReady(); }
      latest.current.onDesktopMessage(event.data);
    }
    // Entering and leaving the computer are deliberate navigation actions.
    // Moving the pointer across the frame must not change the camera view.
    iframe.addEventListener("load", sendState);
    window.addEventListener("message", message);
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    projectionRef.current = {
      render(camera) {
        lastCamera = camera;
        if (!latest.current.expanded) renderer.render(scene, camera);
      },
    };
    // The object gets its final DOM parent before the browsing context exists.
    const initialCamera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 1500);
    initialCamera.position.set(-35000 / 900, 35000 / 900, 35000 / 900);
    initialCamera.lookAt(0, -5000 / 900, 0);
    initialCamera.updateMatrixWorld();
    renderer.render(scene, initialCamera);
    iframe.src = "/desktop";

    return () => {
      observer.disconnect();
      window.removeEventListener("message", message);
      iframe.removeEventListener("load", sendState);
      projectionRef.current = null;
      iframeRef.current = null;
      objectRef.current = null;
      renderer.domElement.remove();
    };
    // The source frame is persistent; changing host state is handled below.
  }, [projectionRef]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const object = objectRef.current;
    if (!iframe || !object) return;
    const active = props.powered && props.view !== "loading" && (props.view === "monitor" || props.expanded);
    iframe.inert = !active;
    iframe.tabIndex = active ? 0 : -1;
    iframe.setAttribute("aria-hidden", String(!active));
    object.style.pointerEvents = active ? "auto" : "none";
    const message: HostStateMessage = { source: "opitlcalos-host", type: "state", active, powered: props.powered, expanded: props.expanded, canFrame: props.canFrame, muted: props.muted, reducedMotion: props.reducedMotion, motionPaused: props.motionPaused };
    iframe.contentWindow?.postMessage(message, window.location.origin);
  }, [props.view, props.powered, props.expanded, props.canFrame, props.muted, props.reducedMotion, props.motionPaused]);

  return <div ref={container} className={`world-screen-layer${props.expanded ? " is-expanded" : ""}${props.powered && props.view !== "loading" && (props.view === "monitor" || props.expanded) ? " is-interactive" : ""}`} />;
}
