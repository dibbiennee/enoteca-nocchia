"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { WineAnalysis } from "@/lib/types";
import WineCard from "@/components/WineCard";
import LanguageToggle from "@/components/LanguageToggle";
import "@/lib/i18n";

const confidenceColors: Record<string, string> = {
  alta: "#22c55e",
  media: "#eab308",
  bassa: "#f97316",
  nulla: "#ef4444",
};

export default function ResultPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [wine, setWine] = useState<WineAnalysis | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastWineAnalysis");
    if (stored) {
      try {
        setWine(JSON.parse(stored));
      } catch {
        router.push("/scan");
      }
    } else {
      router.push("/scan");
    }
  }, [router]);

  if (!wine) return null;

  // Schermata errore se confidenza nulla
  if (wine.confidenza === "nulla") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-6 md:px-12 gap-6 text-center"
        style={{
          background: "var(--color-bg)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <LanguageToggle />

        <div className="text-6xl md:text-7xl animate-fade-in-1">🍷</div>

        <h2
          className="text-2xl md:text-3xl font-bold animate-fade-in-2"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-gold)",
          }}
        >
          {t("error.not_recognized")}
        </h2>

        <p
          className="text-base md:text-lg max-w-sm md:max-w-md animate-fade-in-2"
          style={{ color: "var(--color-muted)" }}
        >
          {wine.descrizione || t("error.retry")}
        </p>

        <button
          onClick={() => router.push("/scan")}
          className="mt-4 px-8 py-4 rounded-xl text-base md:text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-3"
          style={{
            background: "var(--color-bordeaux)",
            color: "var(--color-gold)",
            border: "1px solid var(--color-gold)",
          }}
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh px-5 md:px-8 lg:px-12 py-8 md:py-10"
      style={{
        background: "var(--color-bg)",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 2rem)",
      }}
    >
      <LanguageToggle />

      <div className="max-w-2xl mx-auto">
        {/* Badge confidenza */}
        <div className="flex justify-center mb-6 md:mb-8">
          <span
            className="px-4 py-1.5 rounded-full text-xs md:text-sm font-medium uppercase tracking-wider animate-fade-in-1"
            style={{
              color: confidenceColors[wine.confidenza],
              border: `1px solid ${confidenceColors[wine.confidenza]}40`,
              background: `${confidenceColors[wine.confidenza]}15`,
            }}
          >
            {t(`result.confidence.${wine.confidenza}`)}
          </span>
        </div>

        {/* Wine Card */}
        <WineCard wine={wine} />

        {/* Bottone altra bottiglia — inline, non fixed */}
        <div className="mt-8 mb-8">
          <button
            onClick={() => router.push("/scan")}
            className="w-full min-h-[52px] py-4 rounded-xl text-base md:text-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95"
            style={{
              background: "var(--color-bordeaux)",
              color: "var(--color-gold)",
              border: "1px solid var(--color-gold)",
            }}
          >
            {t("result.another")}
          </button>
        </div>
      </div>
    </div>
  );
}
