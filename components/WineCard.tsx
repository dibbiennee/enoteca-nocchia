"use client";

import { useTranslation } from "react-i18next";
import { WineAnalysis } from "@/lib/types";
import TastingNotes from "./TastingNotes";
import FoodPairing from "./FoodPairing";

interface WineCardProps {
  wine: WineAnalysis;
}

export default function WineCard({ wine }: WineCardProps) {
  const { t } = useTranslation();

  const sections = [
    // Header + Identity
    <div key="header" className="space-y-4">
      <h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
        style={{
          fontFamily: "var(--font-playfair)",
          color: "var(--color-gold)",
        }}
      >
        {wine.nome_vino}
      </h1>

      <p className="text-base md:text-lg" style={{ color: "var(--color-muted)" }}>
        {wine.produttore}
        {wine.annata && ` · ${wine.annata}`}
      </p>

      <div className="flex flex-wrap gap-2">
        {wine.regione && (
          <span
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--color-gold)",
            }}
          >
            {wine.regione}
          </span>
        )}
        {wine.denominazione && (
          <span
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--color-gold)",
            }}
          >
            {wine.denominazione}
          </span>
        )}
        {wine.vitigni.map((v, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--color-gold)",
            }}
          >
            {v}
          </span>
        ))}
        {wine.gradazione && (
          <span
            className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium"
            style={{
              border: "1px solid rgba(201,168,76,0.3)",
              color: "var(--color-text)",
            }}
          >
            {wine.gradazione}
          </span>
        )}
      </div>
    </div>,

    // Descrizione
    <div
      key="descrizione"
      className="rounded-xl p-4 md:p-6"
      style={{
        borderLeft: "3px solid var(--color-bordeaux)",
        background: "var(--color-surface)",
      }}
    >
      <p
        className="italic text-[0.95rem] md:text-base leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        {wine.descrizione}
      </p>
    </div>,

    // Note visive
    <TastingNotes
      key="visive"
      icon="👁"
      title={t("result.sections.visual")}
      text={wine.note_visive}
    />,

    // Note olfattive
    <TastingNotes
      key="olfattive"
      icon="🌸"
      title={t("result.sections.nose")}
      text={wine.note_olfattive}
    />,

    // Note gustative
    <TastingNotes
      key="gustative"
      icon="👅"
      title={t("result.sections.palate")}
      text={wine.note_gustative}
    />,

    // Temperatura
    <div
      key="temperatura"
      className="rounded-xl p-4 md:p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl md:text-3xl">🌡</span>
        <h3
          className="font-bold uppercase tracking-wider text-[0.8rem] md:text-[0.9rem]"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-gold)",
          }}
        >
          {t("result.sections.temperature")}
        </h3>
      </div>
      <p
        className="text-[0.95rem] md:text-base leading-relaxed"
        style={{ color: "var(--color-text)" }}
      >
        {wine.temperatura_servizio}
      </p>
    </div>,

    // Abbinamenti
    <FoodPairing
      key="abbinamenti"
      title={t("result.sections.pairings")}
      pairings={wine.abbinamenti}
    />,
  ];

  return (
    <div className="space-y-4 md:space-y-5">
      {sections.map((section, i) => (
        <div
          key={i}
          className="animate-stagger"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {section}
        </div>
      ))}
    </div>
  );
}
