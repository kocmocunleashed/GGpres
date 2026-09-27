"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "opitlcal-presentation-3d";
const CHANGE_EVENT = "opitlcal-presentation-3d-change";
let memoryEnabled = true;
let memoryOnly = false;

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  if (memoryOnly) return memoryEnabled;
  try {
    memoryEnabled = window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    // Keep the control usable when browser storage is unavailable.
  }
  return memoryEnabled;
}

// Read the saved choice before mounting a canvas on the client.
function getServerSnapshot() { return false; }

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    memoryEnabled = event.newValue !== "off";
    memoryOnly = false;
    onChange();
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setGraphicsEnabled(enabled: boolean) {
  memoryEnabled = enabled;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    memoryOnly = false;
  } catch {
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function usePresentationGraphics(): readonly [boolean, (enabled: boolean) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setGraphicsEnabled] as const;
}
