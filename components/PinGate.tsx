"use client";

import { useState, useEffect, useRef } from "react";

const PIN_CODE = "1926";
const SESSION_KEY = "nocchia_pin_ok";

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if already unlocked this session
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!unlocked && !loading) {
      inputRef.current?.focus();
    }
  }, [unlocked, loading]);

  const handleSubmit = () => {
    if (pin === PIN_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (loading) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
      style={{ background: "var(--color-bg)" }}
    >
      <h1
        className="text-3xl md:text-4xl font-bold mb-2"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--color-gold)" }}
      >
        Enoteca Nocchia
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
        Inserisci il PIN per accedere
      </p>

      <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          onKeyDown={handleKeyDown}
          className="w-full text-center text-2xl tracking-[0.5em] py-3 rounded-xl outline-none transition-colors"
          style={{
            background: "var(--color-surface)",
            border: error ? "2px solid #c0392b" : "1px solid rgba(120,94,20,0.3)",
            color: "var(--color-text)",
            fontFamily: "var(--font-dm-sans)",
          }}
          placeholder="····"
          autoComplete="off"
        />

        {error && (
          <p className="text-sm" style={{ color: "#c0392b" }}>
            PIN errato
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={pin.length < 4}
          className="w-full py-3 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-40"
          style={{
            background: "var(--color-bordeaux)",
            color: "#FFFFFF",
          }}
        >
          Entra
        </button>
      </div>
    </div>
  );
}
