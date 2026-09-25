"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsInstance } from "three-stdlib";
import type { WorkstationView } from "@/lib/desktop-bridge";

const UNIT = 1 / 900;
const point = (x: number, y: number, z: number) => new Vector3(x * UNIT, y * UNIT, z * UNIT);
const initialPosition = point(-35000, 35000, 35000);
const initialTarget = point(0, -5000, 0);

function exponentialOut(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function quinticInOut(t: number) { return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2; }
/** Invert the original cubic-bezier(.13,.99,0,1), including its x axis. */
function monitorEase(t: number) {
  let low = 0, high = 1;
  for (let i = 0; i < 12; i++) {
    const u = (low + high) / 2;
    const x = 3 * (1 - u) ** 2 * u * 0.13 + u ** 3;
    if (x < t) low = u; else high = u;
  }
  const u = (low + high) / 2;
  return 3 * (1 - u) ** 2 * u * 0.99 + 3 * (1 - u) * u ** 2 + u ** 3;
}

export default function CameraRig({ view, reducedMotion, motionPaused, expanded, interactionLocked = false }: {
  view: WorkstationView; reducedMotion: boolean; motionPaused: boolean; expanded: boolean; interactionLocked?: boolean;
}) {
  const { size } = useThree();
  const controls = useRef<OrbitControlsInstance>(null);
  const activeView = useRef<WorkstationView>("loading");
  const freeCameraReady = useRef(false);
  const elapsed = useRef(0);
  const transition = useRef({ time: 0, duration: 0, ease: exponentialOut });
  const from = useRef(initialPosition.clone());
  const fromTarget = useRef(initialTarget.clone());
  const target = useRef(initialTarget.clone());
  const destination = useMemo(() => new Vector3(), []);
  const destinationTarget = useMemo(() => new Vector3(), []);
  useEffect(() => { freeCameraReady.current = false; }, [size.width, size.height]);

  useFrame(({ camera, pointer }, delta) => {
    if (expanded) return;
    if (!reducedMotion && !motionPaused) elapsed.current += delta * 1000;
    const ratio = size.height / size.width;

    switch (view) {
      case "loading":
        destination.copy(initialPosition); destinationTarget.copy(initialTarget); break;
      case "overview": {
        const time = reducedMotion ? 0 : elapsed.current;
        destination.set(Math.sin((time + 19000) * 0.00008) * -20000 * UNIT, (Math.sin((time + 1000) * 0.000004) * 4000 + 9000) * UNIT, 20000 * UNIT);
        destinationTarget.copy(point(0, -1000, 0));
        break;
      }
      case "desk": {
        const px = reducedMotion || motionPaused ? 0 : pointer.x;
        const py = reducedMotion || motionPaused ? 0 : pointer.y;
        destination.set(px * size.width / 2 * UNIT, size.height * (1.5 + py * 0.5) * UNIT, (5500 + ratio * 3000 - 1800) * UNIT);
        destinationTarget.set(px * size.width / 2 * UNIT, size.height * (0.5 + py * 0.5) * UNIT, 0);
        break;
      }
      case "monitor":
        destination.copy(point(0, 950, 2000 + ratio * 1200 - (size.width < 768 ? 0 : 600)));
        destinationTarget.copy(point(0, 950, 0));
        break;
      case "orbit":
        destination.copy(point(-15000, 10000, 15000));
        destinationTarget.copy(point(-100, 350, 0));
        break;
      case "room": {
        const distanceScale = Math.max(1, ratio / 0.86);
        destinationTarget.set(0.7, -1.1, 0.5);
        destination.set(-6, 4, 11.5).sub(destinationTarget).multiplyScalar(distanceScale).add(destinationTarget);
        break;
      }
    }

    if (view !== activeView.current) {
      const previous = activeView.current;
      activeView.current = view;
      freeCameraReady.current = false;
      from.current.copy(camera.position);
      fromTarget.current.copy(target.current);
      const duration = reducedMotion || motionPaused ? 0 : previous === "loading" && view === "overview" ? 2.5 : view === "monitor" ? 2 : view === "orbit" ? 0.75 : previous === "orbit" && view === "overview" ? 4 : 1;
      const ease = view === "monitor" || view === "orbit" ? monitorEase : previous === "loading" || previous === "orbit" && view === "overview" ? exponentialOut : quinticInOut;
      transition.current = { time: 0, duration, ease };
      if (controls.current) controls.current.enabled = false;
    }

    const movement = transition.current;
    const moving = movement.time < movement.duration;
    if ((view === "orbit" || view === "room") && !moving) {
      if (controls.current) {
        if (!freeCameraReady.current) {
          camera.position.copy(destination);
          controls.current.target.copy(destinationTarget);
          freeCameraReady.current = true;
          controls.current.update();
        }
        controls.current.enabled = !interactionLocked;
        target.current.copy(controls.current.target);
      }
      return;
    }
    if (controls.current) controls.current.enabled = false;
    if (moving) {
      movement.time = Math.min(movement.duration, movement.time + delta);
      const amount = reducedMotion || motionPaused ? 1 : movement.ease(movement.time / movement.duration);
      camera.position.lerpVectors(from.current, destination, amount);
      target.current.lerpVectors(fromTarget.current, destinationTarget, amount);
    } else if (view === "desk" && !reducedMotion && !motionPaused) {
      camera.position.lerp(destination, 1 - Math.exp(-1.52 * delta));
      target.current.lerp(destinationTarget, 1 - Math.exp(-3.08 * delta));
    } else {
      camera.position.copy(destination);
      target.current.copy(destinationTarget);
    }
    camera.lookAt(target.current);
    camera.updateMatrixWorld();
  });

  return <OrbitControls ref={controls} enabled={false} enablePan={false} enableDamping={!reducedMotion && !motionPaused} dampingFactor={0.05} maxPolarAngle={Math.PI / 2} minDistance={4000 * UNIT} maxDistance={Math.max(29000 * UNIT, 35 * size.height / size.width)} />;
}
