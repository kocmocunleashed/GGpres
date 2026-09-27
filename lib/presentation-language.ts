"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Language } from "@/lib/presentation-data";

const STORAGE_KEY = "opitlcal-presentation-language";
const CHANGE_EVENT = "opitlcal-presentation-language-change";
let memoryLanguage: Language = "en";
let memoryOnly = false;

function parseLanguage(value: string | null): Language {
  return value === "mn" ? "mn" : "en";
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  if (memoryOnly) return memoryLanguage;
  try {
    memoryLanguage = parseLanguage(window.localStorage.getItem(STORAGE_KEY));
    return memoryLanguage;
  } catch {
    return memoryLanguage;
  }
}

function getServerSnapshot(): Language {
  return "en";
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    memoryLanguage = parseLanguage(event.newValue);
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

function setLanguage(language: Language) {
  memoryLanguage = language;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
    memoryOnly = false;
  } catch {
    // The choice still works for this page when browser storage is blocked.
    memoryOnly = true;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function usePresentationLanguage(): readonly [
  Language,
  (language: Language) => void,
] {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return [language, setLanguage] as const;
}
