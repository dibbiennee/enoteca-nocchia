"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function LoadingWine() {
  const { t } = useTranslation();
  const messages = t("loading.messages", { returnObjects: true }) as string[];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
      style={{
        background: "var(--color-bg)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "3px solid var(--color-border)",
            borderTopColor: "var(--color-gold)",
          }}
        />
      </div>
      <p
        className="text-lg md:text-xl italic transition-opacity duration-300 px-6 text-center"
        style={{
          color: "var(--color-muted)",
          fontFamily: "var(--font-playfair)",
          opacity: fade ? 1 : 0,
        }}
      >
        {messages[index]}
      </p>
    </div>
  );
}
