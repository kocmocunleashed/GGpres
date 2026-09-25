import { Activity, FileText, Folder, Gamepad2, Info, Settings2, ShoppingBag, Terminal } from "lucide-react";
import type { AppId } from "@/store/system";
import WaveMark from "@/components/visual/WaveMark";

const icons = { files: Folder, terminal: Terminal, "system-monitor": Activity, settings: Settings2, about: Info, software: ShoppingBag, runner: Gamepad2 };

export default function AppIcon({ appId, size = 48, className = "" }: { appId: AppId; size?: number; className?: string }) {
  const Icon = appId === "lesson" ? null : icons[appId] || FileText;
  return (
    <span className={`desktop-app-icon icon-${appId} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {Icon ? <Icon size={size * .53} strokeWidth={1.65} /> : <WaveMark />}
    </span>
  );
}
