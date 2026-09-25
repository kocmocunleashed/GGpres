"use client";

import { create } from "zustand";
import { createFilesystem, TOTAL_MEMORY_MB, type VirtualFilesystem } from "@/lib/filesystem";

export type AppId = "lesson" | "files" | "terminal" | "system-monitor" | "settings" | "about" | "software" | "runner";
export type DesktopTheme = "wave" | "monochrome" | "pink";
export type WindowState = { id: string; appId: AppId; title: string; x: number; y: number; width: number; height: number; minimized: boolean; maximized: boolean; zIndex: number; processId: number };
export type ProcessState = { pid: number; name: string; memory: number; cpu: number; protected?: boolean; appId?: AppId };
export type NotificationState = { id: string; title: string; message: string };
export const APP_META: Record<AppId, { title: string; processName: string; color: string; memory: number; cpu: number; description: string }> = {
  lesson: { title: "Operating Systems", processName: "lesson", color: "#a695ff", memory: 312, cpu: 3.2, description: "Explore beneath the surface" },
  files: { title: "Files", processName: "files", color: "#6eb8ff", memory: 96, cpu: 0.7, description: "Your virtual home folder" },
  terminal: { title: "Terminal", processName: "terminal", color: "#8ad9ae", memory: 48, cpu: 0.3, description: "A conversation with your system" },
  "system-monitor": { title: "System Monitor", processName: "system-monitor", color: "#81d5bd", memory: 72, cpu: 1.1, description: "See what is running" },
  settings: { title: "Settings", processName: "settings", color: "#aeb4c3", memory: 84, cpu: 0.4, description: "Make this space yours" },
  about: { title: "About opitlcalOS", processName: "about", color: "#9e9aff", memory: 32, cpu: 0.1, description: "Meet your workstation" },
  software: { title: "Software", processName: "software", color: "#eaa36c", memory: 108, cpu: 0.5, description: "A carefully curated collection" },
  runner: { title: "Dino Runner", processName: "dino-runner", color: "#83b995", memory: 64, cpu: 1.4, description: "A little prehistoric downtime" },
};
export { TOTAL_MEMORY_MB };
export const totalMemory = (processes: ProcessState[]) => processes.reduce((sum, process) => sum + process.memory, 0);
export const totalCpu = (processes: ProcessState[]) => Math.min(100, processes.reduce((sum, process) => sum + process.cpu, 0));
const baseProcesses = (): ProcessState[] => [
  { pid: 1, name: "system-services", memory: 384, cpu: 0.4, protected: true },
  { pid: 42, name: "opitlcal-shell", memory: 256, cpu: 1.2, protected: true },
  { pid: 86, name: "display-server", memory: 192, cpu: 0.8, protected: true },
];

type SystemStore = {
  windows: WindowState[]; processes: ProcessState[]; filesystem: VirtualFilesystem; notifications: NotificationState[];
  muted: boolean; reducedMotion: boolean; motionPaused: boolean; wallpaper: "wave" | "dusk"; theme: DesktopTheme;
  lessonIndex: number; lessonComplete: boolean; lessonPresenting: boolean; startedAt: number; nextPid: number; nextNotification: number;
  openApp: (appId: AppId) => void; closeWindow: (id: string) => void; focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void; toggleMaximize: (id: string) => void; moveWindow: (id: string, x: number, y: number) => void;
  killProcess: (pid: number) => boolean; setMuted: (value: boolean) => void; setReducedMotion: (value: boolean) => void;
  setMotionPaused: (value: boolean) => void; setWallpaper: (value: "wave" | "dusk") => void;
  setTheme: (value: DesktopTheme) => void;
  setLessonIndex: (value: number) => void; setLessonComplete: (value: boolean) => void; setLessonPresenting: (value: boolean) => void;
  notify: (title: string, message: string) => void; dismissNotification: (id: string) => void; resetSession: () => void;
};

const nextZ = (windows: WindowState[]) => Math.max(10, ...windows.map((window) => window.zIndex)) + 1;

export const useSystemStore = create<SystemStore>((set, get) => ({
  windows: [], processes: baseProcesses(), filesystem: createFilesystem(), notifications: [], muted: true,
  reducedMotion: false, motionPaused: false, wallpaper: "wave", theme: "wave", lessonIndex: 0, lessonComplete: false,
  lessonPresenting: false, startedAt: Date.now(), nextPid: 200, nextNotification: 1,
  openApp: (appId) => set((state) => {
    const existing = state.windows.find((window) => window.appId === appId);
    if (existing) return { windows: state.windows.map((window) => window.id === existing.id ? { ...window, minimized: false, zIndex: nextZ(state.windows) } : window) };
    const meta = APP_META[appId];
    const viewportWidth = typeof window === "undefined" ? 1440 : window.innerWidth;
    const viewportHeight = typeof window === "undefined" ? 900 : window.innerHeight;
    const width = Math.min(appId === "lesson" ? 1020 : 800, viewportWidth - 24);
    const height = Math.min(appId === "lesson" ? 690 : 530, viewportHeight - 120);
    const offset = (state.windows.length % 4) * 24;
    const processId = state.nextPid;
    return {
      windows: [...state.windows, { id: `window-${appId}`, appId, title: meta.title, x: Math.max(12, Math.min((viewportWidth - width) / 2 + offset, viewportWidth - width - 12)), y: Math.max(44, Math.min((viewportHeight - height) / 2 - 16 + offset, viewportHeight - height - 88)), width, height, minimized: false, maximized: false, zIndex: nextZ(state.windows), processId }],
      processes: [...state.processes, { pid: processId, name: meta.processName, memory: meta.memory, cpu: meta.cpu, appId }], nextPid: processId + 1,
    };
  }),
  closeWindow: (id) => set((state) => {
    const closing = state.windows.find((window) => window.id === id);
    return { windows: state.windows.filter((window) => window.id !== id), processes: state.processes.filter((process) => process.pid !== closing?.processId), ...(closing?.appId === "lesson" ? { lessonPresenting: false } : {}) };
  }),
  focusWindow: (id) => set((state) => ({ windows: state.windows.map((window) => window.id === id ? { ...window, zIndex: nextZ(state.windows), minimized: false } : window) })),
  minimizeWindow: (id) => set((state) => ({ windows: state.windows.map((window) => window.id === id ? { ...window, minimized: true } : window) })),
  toggleMaximize: (id) => set((state) => ({ windows: state.windows.map((window) => window.id === id ? { ...window, maximized: !window.maximized, zIndex: nextZ(state.windows) } : window) })),
  moveWindow: (id, x, y) => set((state) => ({ windows: state.windows.map((window) => window.id === id ? { ...window, x, y } : window) })),
  killProcess: (pid) => {
    const process = get().processes.find((process) => process.pid === pid);
    if (!process || process.protected) return false;
    set((state) => ({ processes: state.processes.filter((process) => process.pid !== pid), windows: state.windows.filter((window) => window.processId !== pid), ...(process.appId === "lesson" ? { lessonPresenting: false } : {}) }));
    get().notify("Process ended", `${process.name} (PID ${pid}) released ${process.memory} MiB of memory.`);
    return true;
  },
  setMuted: (muted) => set({ muted }), setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setMotionPaused: (motionPaused) => set({ motionPaused }), setWallpaper: (wallpaper) => set({ wallpaper }),
  setTheme: (theme) => set({ theme }),
  setLessonIndex: (lessonIndex) => set({ lessonIndex: Math.max(0, lessonIndex) }), setLessonComplete: (lessonComplete) => set({ lessonComplete }),
  setLessonPresenting: (lessonPresenting) => set({ lessonPresenting }),
  notify: (title, message) => set((state) => ({ notifications: [...state.notifications.slice(-3), { id: `notification-${state.nextNotification}`, title, message }], nextNotification: state.nextNotification + 1 })),
  dismissNotification: (id) => set((state) => ({ notifications: state.notifications.filter((notification) => notification.id !== id) })),
  resetSession: () => set({ windows: [], processes: baseProcesses(), filesystem: createFilesystem(), notifications: [], lessonIndex: 0, lessonComplete: false, lessonPresenting: false, startedAt: Date.now(), nextPid: 200 }),
}));
