# CLAUDE.md — Enoteca Nocchia Wine Scanner

## Panoramica progetto

Web app PWA per tablet e mobile che permette ai clienti dell'**Enoteca Nocchia** di fotografare una bottiglia di vino con la fotocamera in tempo reale e ottenere istantaneamente una scheda tecnica completa generata da Claude Vision.

**Nessun database esterno. Nessun login. Solo AI.**

---

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude claude-sonnet-4-20250514 Vision (API) |
| Deploy | Vercel |
| PWA | next-pwa |
| Camera | MediaDevices API (getUserMedia) |
| i18n | react-i18next (IT default, EN toggle) |

---

## Struttura cartelle

```
/app
  /page.tsx                   → Home: logo + pulsante "Fotografa"
  /scan/page.tsx              → Fotocamera live stream + pulsante scatto
  /result/page.tsx            → Scheda tecnica animata del vino
  /api/analyze-wine/route.ts  → API route: riceve immagine base64 → chiama Claude → ritorna JSON

/components
  CameraStream.tsx            → Stream webcam live con overlay grafico
  WineCard.tsx                → Scheda tecnica (nome, regione, note, abbinamenti, temp)
  TastingNotes.tsx            → Note visive / olfattive / gustative con icone
  FoodPairing.tsx             → Abbinamenti cibo con icone
  LanguageToggle.tsx          → Pulsante IT | EN in header
  LoadingWine.tsx             → Animazione caricamento elegante

/lib
  anthropic.ts                → Client Anthropic + buildPrompt(lang)
  types.ts                    → Interfaccia WineAnalysis

/public
  manifest.json               → PWA manifest
  icons/                      → App icons (192x192, 512x512)

/locales
  it.json                     → Testi UI in italiano
  en.json                     → Testi UI in inglese
```

---

## Flusso utente completo

```
[HOME]
  Logo Enoteca Nocchia
  Headline bilingue
  Pulsante grande → "📷 Fotografa la bottiglia"

       ↓

[SCAN /scan]
  Stream fotocamera attivo a tutto schermo
  Overlay: cornice guida bottiglia
  Pulsante scatto (cerchio bianco in basso al centro)
  Dopo scatto → preview + "Analizza" | "Riprendi"

       ↓

[LOADING]
  Animazione elegante + frase tipo "Il sommelier sta analizzando..."

       ↓

[RESULT /result]
  Scheda tecnica completa animata (staggered reveal)
  Sezioni: Identità | Note | Abbinamenti | Temperatura
  Pulsante "Analizza un'altra bottiglia" → torna a /scan
```

---

## API Route `/api/analyze-wine`

```typescript
// app/api/analyze-wine/route.ts

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic(); // usa ANTHROPIC_API_KEY da env

export async function POST(req: NextRequest) {
  const { imageBase64, lang } = await req.json();
  // imageBase64: stringa base64 dell'immagine JPEG
  // lang: "it" | "en"

  const prompt = buildPrompt(lang);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64,
            },
          },
          { type: "text", text: prompt },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  
  // Estrai JSON dalla risposta (Claude potrebbe aggiungere testo attorno)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Impossibile analizzare l'immagine" }, { status: 422 });
  }

  const wineData = JSON.parse(jsonMatch[0]);
  return NextResponse.json(wineData);
}
```

---

## Prompt Claude (core del prodotto)

```typescript
// lib/anthropic.ts

export function buildPrompt(lang: "it" | "en"): string {
  const outputLang = lang === "it" ? "italiano" : "English";

  return `
Sei un sommelier esperto con 20 anni di esperienza nelle enoteche italiane.
Analizza attentamente l'etichetta nella foto e descrivi il vino in modo
professionale ma accessibile, come se parlassi con un cliente curioso
che non è un esperto.

Usa un linguaggio caldo, evocativo e semplice. Evita termini tecnici
senza spiegarli. Fai immaginare il vino.

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido, senza markdown,
senza testo prima o dopo. Lingua dell'output: ${outputLang}.

Schema JSON richiesto:
{
  "nome_vino": "string — nome completo del vino",
  "produttore": "string — cantina o produttore",
  "annata": "string — anno (es. '2019') o 'N.V.' se non vintage",
  "regione": "string — regione di provenienza",
  "paese": "string — paese (es. 'Italia')",
  "denominazione": "string — DOC / DOCG / IGT / VdT o equivalente",
  "vitigni": ["array di stringhe con percentuali se note, es. 'Sangiovese 90%'"],
  "gradazione": "string — es. '13.5%'",
  "temperatura_servizio": "string — es. '16-18°C' con breve nota sul perché",
  "note_visive": "string — colore e aspetto spiegati semplicemente",
  "note_olfattive": "string — profumi descritti in modo evocativo e comprensibile",
  "note_gustative": "string — sapore e sensazioni in bocca spiegate chiaramente",
  "abbinamenti": ["array di 3-5 abbinamenti cibo specifici e appetitosi"],
  "descrizione": "string — 2-3 frasi che raccontano la personalità del vino in modo coinvolgente",
  "confidenza": "string — 'alta' | 'media' | 'bassa' | 'nulla'"
}

Se l'etichetta non è leggibile o non è una bottiglia di vino,
restituisci lo stesso schema con confidenza 'nulla' e spiega in 'descrizione'.
`;
}
```

---

## Interfaccia TypeScript

```typescript
// lib/types.ts

export interface WineAnalysis {
  nome_vino: string;
  produttore: string;
  annata: string;
  regione: string;
  paese: string;
  denominazione: string;
  vitigni: string[];
  gradazione: string;
  temperatura_servizio: string;
  note_visive: string;
  note_olfattive: string;
  note_gustative: string;
  abbinamenti: string[];
  descrizione: string;
  confidenza: "alta" | "media" | "bassa" | "nulla";
}
```

---

## PWA Setup

```json
// public/manifest.json
{
  "name": "Enoteca Nocchia",
  "short_name": "Nocchia",
  "description": "Scopri ogni bottiglia con il tuo sommelier AI",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "portrait",
  "background_color": "#0a0a0a",
  "theme_color": "#8B1A1A",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({ /* next config */ });
```

---

## Design System — Dark Elegante

### Palette
```css
--color-bg:        #0a0a0a;   /* nero profondo */
--color-surface:   #141414;   /* card / superfici */
--color-border:    #2a2a2a;   /* bordi sottili */
--color-gold:      #C9A84C;   /* oro elegante — accento principale */
--color-bordeaux:  #8B1A1A;   /* bordeaux — accento secondario */
--color-text:      #F5F0E8;   /* bianco caldo */
--color-muted:     #888880;   /* testo secondario */
```

### Tipografia
- Display / titoli: `Playfair Display` (serif elegante)
- Body / UI: `DM Sans` (pulito, leggibile)
- Importa da Google Fonts

### Principi UI
- Bordi sottili dorati sulle card (`border: 1px solid var(--color-gold) / 30%`)
- Animazioni staggered sul reveal della scheda (stagger 100ms per sezione)
- Icone semplici per ogni sezione (👁 visivo, 👃 olfattivo, 👅 gustativo, 🌡 temperatura, 🍽 abbinamenti)
- Bottone principale: sfondo bordeaux, testo oro, bordo gold
- Loading: spinner minimal dorato + frase random del sommelier

---

## Variabili d'ambiente

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Localizzazione (struttura base)

```json
// locales/it.json
{
  "home": {
    "headline": "Scopri ogni bottiglia",
    "subheadline": "Fotografa un vino e il nostro sommelier AI ti racconta tutto",
    "cta": "Fotografa la bottiglia"
  },
  "scan": {
    "instruction": "Inquadra l'etichetta",
    "capture": "Scatta",
    "retake": "Riprendi",
    "analyze": "Analizza"
  },
  "loading": {
    "messages": [
      "Il sommelier sta assaggiando...",
      "Annusando i profumi...",
      "Consultando la cantina..."
    ]
  },
  "result": {
    "another": "Analizza un'altra bottiglia",
    "sections": {
      "identity": "Identità",
      "visual": "All'occhio",
      "nose": "Al naso",
      "palate": "In bocca",
      "temperature": "Temperatura di servizio",
      "pairings": "Si abbina con"
    }
  }
}
```

---

## Comandi per iniziare

```bash
npx create-next-app@latest enoteca-nocchia --typescript --tailwind --app
cd enoteca-nocchia
npm install @anthropic-ai/sdk next-pwa react-i18next i18next
npm install -D @types/node
```

---

## Note implementative importanti

1. **Camera su mobile**: usa `facingMode: "environment"` per aprire la fotocamera posteriore
2. **Compressione immagine**: ridurre la foto a max 1000px e qualità 80% prima di inviare in base64 (risparmio token Anthropic)
3. **Gestione errori**: se `confidenza === "nulla"` mostrare schermata "Etichetta non riconosciuta" con pulsante riprova
4. **CORS**: l'API route Next.js non ha problemi CORS essendo same-origin
5. **Rate limiting**: opzionale — aggiungere un semplice delay tra chiamate se necessario

---

## Stato attuale: PRONTO PER SVILUPPO ✅
