"use client";

import { useTranslation } from "react-i18next";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 text-sm font-medium" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <button
        onClick={() => i18n.changeLanguage("it")}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-colors duration-200"
        style={{
          color: currentLang === "it" ? "var(--color-gold)" : "var(--color-muted)",
        }}
      >
        IT
      </button>
      <span className="flex items-center" style={{ color: "var(--color-muted)" }}>|</span>
      <button
        onClick={() => i18n.changeLanguage("en")}
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
