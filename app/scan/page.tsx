"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CameraStream from "@/components/CameraStream";
import LoadingWine from "@/components/LoadingWine";
import LanguageToggle from "@/components/LanguageToggle";
import "@/lib/i18n";

export default function ScanPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCapture = (base64: string) => {
    setCapturedImage(base64);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze-wine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: capturedImage,
          lang: i18n.language as "it" | "en",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.data) {
          localStorage.setItem("lastWineAnalysis", JSON.stringify(data.data));
        } else {
          localStorage.setItem(
            "lastWineAnalysis",
            JSON.stringify({
              nome_vino: "",
              produttore: "",
              annata: "",
              regione: "",
              paese: "",
              denominazione: "",
              vitigni: [],
              gradazione: "",
              temperatura_servizio: "",
              note_visive: "",
              note_olfattive: "",
              note_gustative: "",
              abbinamenti: [],
              descrizione: data.error || t("error.api_error"),
              confidenza: "nulla" as const,
            })
          );
        }
      } else {
        localStorage.setItem("lastWineAnalysis", JSON.stringify(data));
      }

      router.push("/result");
    } catch {
      setIsAnalyzing(false);
      alert(t("error.api_error"));
    }
  };

  if (isAnalyzing) {
    return <LoadingWine />;
  }

  // Preview dell'immagine catturata
  if (capturedImage) {
    return (
      <div
        className="fixed inset-0 flex flex-col"
        style={{
          background: "var(--color-bg)",
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <LanguageToggle />

        {/* Preview immagine */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <img
            src={`data:image/jpeg;base64,${capturedImage}`}
            alt="Preview"
            className="max-w-full max-h-[65vh] md:max-h-[70vh] rounded-xl object-contain"
            style={{ border: "1px solid var(--color-border)" }}
          />
        </div>

        {/* Bottoni azione */}
        <div className="flex gap-4 justify-center px-6 md:px-12 pb-8 max-w-lg mx-auto w-full">
          <button
            onClick={handleRetake}
            className="flex-1 min-h-[52px] py-4 rounded-xl text-base md:text-lg font-medium transition-colors"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              background: "transparent",
            }}
          >
            {t("scan.retake")}
          </button>
          <button
            onClick={handleAnalyze}
            className="flex-1 min-h-[52px] py-4 rounded-xl text-base md:text-lg font-medium transition-colors"
            style={{
              background: "var(--color-bordeaux)",
              color: "var(--color-gold)",
              border: "1px solid var(--color-gold)",
            }}
          >
            {t("scan.analyze")}
          </button>
        </div>
      </div>
    );
  }

  // Camera stream
  return (
    <>
      <LanguageToggle />
      <CameraStream onCapture={handleCapture} />
    </>
  );
}
