export type RunnerStatus = "ready" | "playing" | "paused" | "crashed";
export type RunnerSnapshot = { source: "opitlcal-runner"; type: "status"; status: RunnerStatus; score: number; best: number };
type RunnerWindow = { appId: string; minimized: boolean; zIndex: number };

/** Only the foremost visible app may spend frames or consume game controls. */
export function isRunnerFocused(windows: readonly RunnerWindow[], lessonPresenting: boolean) {
  if (lessonPresenting) return false;
  let foremost: RunnerWindow | undefined;
  for (const window of windows) {
    if (!window.minimized && (!foremost || window.zIndex > foremost.zIndex)) foremost = window;
  }
  return foremost?.appId === "runner";
}

export function isRunnerSnapshot(value: unknown): value is RunnerSnapshot {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return message.source === "opitlcal-runner" && message.type === "status"
    && ["ready", "playing", "paused", "crashed"].includes(String(message.status))
    && typeof message.score === "number" && Number.isFinite(message.score) && message.score >= 0
    && typeof message.best === "number" && Number.isFinite(message.best) && message.best >= 0;
}
