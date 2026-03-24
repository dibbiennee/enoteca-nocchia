"use client";

import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex gap-1 text-sm font-medium rounded-lg px-2 py-1"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <button
        onClick={() => { i18n.changeLanguage("it"); document.documentElement.lang = "it"; }}
        aria-pressed={currentLang === "it"}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors duration-200"
        style={{
          color: currentLang === "it" ? "var(--color-gold)" : "var(--color-muted)",
        }}
      >
        IT
      </button>
      <span className="flex items-center" style={{ color: "var(--color-muted)" }}>|</span>
      <button
        onClick={() => { i18n.changeLanguage("en"); document.documentElement.lang = "en"; }}
        aria-pressed={currentLang === "en"}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors duration-200"
        style={{
          color: currentLang === "en" ? "var(--color-gold)" : "var(--color-muted)",
        }}
      >
        EN
      </button>
    </div>
  );
}
