"use client";

interface TastingNotesProps {
  icon: string;
  title: string;
  text: string;
}

export default function TastingNotes({ icon, title, text }: TastingNotesProps) {
  return (
    <div
      className="rounded-xl p-4 md:p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl md:text-3xl">{icon}</span>
        <h3
          className="font-bold uppercase tracking-wider text-[0.8rem] md:text-[0.9rem]"
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
        style={{ color: "var(--color-text)" }}
      >
        {text}
      </p>
    </div>
  );
}
