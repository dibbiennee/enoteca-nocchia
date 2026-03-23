"use client";

interface FoodPairingProps {
  title: string;
  pairings: string[];
}

export default function FoodPairing({ title, pairings }: FoodPairingProps) {
  return (
    <div
      className="rounded-xl p-4 md:p-6"
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(201,168,76,0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl md:text-3xl">🍽</span>
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
      <div className="flex flex-wrap gap-2">
        {pairings.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full text-sm md:text-base font-medium"
            style={{
              background: "rgba(139,26,26,0.25)",
              color: "var(--color-text)",
              border: "1px solid rgba(139,26,26,0.4)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
