"use client";

import { usePresentationLanguage } from "@/lib/presentation-language";
import "./language-toggle.css";

export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const [language, setLanguage] = usePresentationLanguage();

  return (
    <div
      className={`language-toggle ${className}`.trim()}
      role="group"
      aria-label={language === "mn" ? "Илтгэлийн хэл" : "Presentation language"}
    >
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="mn"
        aria-label="Монгол"
        aria-pressed={language === "mn"}
        onClick={() => setLanguage("mn")}
      >
        Монгол
      </button>
    </div>
  );
}
