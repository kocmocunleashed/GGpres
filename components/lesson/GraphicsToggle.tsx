"use client";

import { Box } from "lucide-react";
import { usePresentationGraphics } from "@/lib/presentation-graphics";
import type { Language } from "@/lib/presentation-data";

export default function GraphicsToggle({ language }: { language: Language }) {
  const [enabled, setEnabled] = usePresentationGraphics();
  const label = language === "en" ? "3D diagrams" : "3D үзүүлэн";
  return <button
    type="button"
    className="p-graphics-toggle"
    aria-pressed={enabled}
    aria-label={label}
    title={language === "en" ? "Turn 3D diagrams on or off" : "3D үзүүлэнг асаах эсвэл унтраах"}
    onClick={() => setEnabled(!enabled)}
  >
    <Box size={17} aria-hidden="true" />
    <span>{label}</span>
    <span className="p-graphics-state" aria-hidden="true">{language === "en" ? enabled ? "On" : "Off" : enabled ? "Асаалттай" : "Унтраалттай"}</span>
  </button>;
}
