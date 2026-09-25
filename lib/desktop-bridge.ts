/** The local desktop iframe only exchanges this small, validated protocol. */
export type WorkstationView = "loading" | "overview" | "desk" | "monitor" | "orbit" | "room";

export type HostStateMessage = {
  source: "waveos-host";
  type: "state";
  active: boolean;
  powered: boolean;
  expanded: boolean;
  canFrame: boolean;
  muted: boolean;
  reducedMotion: boolean;
  motionPaused: boolean;
};

export type DesktopMessage = { source: "waveos-desktop" } & (
  | { type: "ready" }
  | { type: "presentation"; active: boolean }
  | { type: "preferences"; muted: boolean; reducedMotion: boolean; motionPaused: boolean }
  | { type: "restart" }
  | { type: "view"; action: "desk" | "expand" | "frame" }
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isHostStateMessage(value: unknown): value is HostStateMessage {
  return isRecord(value) && value.source === "waveos-host" && value.type === "state"
    && ["active", "powered", "expanded", "canFrame", "muted", "reducedMotion", "motionPaused"].every((key) => typeof value[key] === "boolean");
}

export function isDesktopMessage(value: unknown): value is DesktopMessage {
  if (!isRecord(value) || value.source !== "waveos-desktop") return false;
  if (value.type === "ready" || value.type === "restart") return true;
  if (value.type === "presentation") return typeof value.active === "boolean";
  if (value.type === "preferences") return ["muted", "reducedMotion", "motionPaused"].every((key) => typeof value[key] === "boolean");
  return value.type === "view" && ["desk", "expand", "frame"].includes(String(value.action));
}
