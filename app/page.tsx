"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import "@/lib/i18n";

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div
      className="relative min-h-dvh flex flex-col items-center justify-center px-6 md:px-12"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Texture noise SVG sottile */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <LanguageToggle />

      {/* Contenuto centrato con animazione staggered */}
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 text-center max-w-lg">
        {/* Logo testuale */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide animate-fade-in-1"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-gold)",
          }}
        >
          Enoteca Nocchia
        </h1>

        {/* Sottotitolo */}
        <p
          className="text-base md:text-lg lg:text-xl max-w-xs md:max-w-md animate-fade-in-2"
          style={{ color: "var(--color-muted)" }}
        >
          {t("home.subheadline")}
        </p>

        {/* Linea decorativa */}
        <div
          className="w-16 md:w-20 h-px animate-fade-in-2"
          style={{ background: "var(--color-gold)", opacity: 0.4 }}
        />

        {/* CTA */}
        <button
          onClick={() => router.push("/scan")}
          className="mt-4 px-8 md:px-10 py-4 md:py-5 rounded-xl text-lg md:text-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-3"
          style={{
            background: "var(--color-bordeaux)",
            color: "var(--color-gold)",
            border: "1px solid var(--color-gold)",
            boxShadow: "0 0 30px rgba(139,26,26,0.3)",
          }}
        >
          {t("home.cta")}
        </button>
      </div>
    </div>
  );
}
