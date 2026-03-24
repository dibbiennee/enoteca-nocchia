"use client";

import { ReactNode } from "react";

interface TastingNotesProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export default function TastingNotes({ icon, title, text }: TastingNotesProps) {
  return (
    <div
      className="rounded-xl p-4 md:p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(120,94,20,0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span style={{ color: "var(--color-gold)" }}>{icon}</span>
        <h3
          className="font-bold uppercase tracking-wider text-sm"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--color-gold)",
          }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-[0.95rem] md:text-base leading-relaxed"
        style={{ color: "var(--color-text)", textAlign: "left", wordBreak: "normal", overflowWrap: "break-word" }}
      >
        {text}
      </p>
    </div>
  );
}
