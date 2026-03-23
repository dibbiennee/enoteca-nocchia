# PROMPT 01 — INIT COMPLETO | Enoteca Nocchia Wine Scanner

Incolla questo prompt come primo messaggio in Claude Code nella root del progetto.

---

## PROMPT DA INCOLLARE

```
Sei l'architetto e sviluppatore principale di "Enoteca Nocchia Wine Scanner".
Leggi il CLAUDE.md nella root prima di fare qualsiasi cosa.

---

## IL TUO SISTEMA DI LAVORO (OBBLIGATORIO)

Per ogni task che esegui, devi seguire questo loop fisso in 3 fasi:

### FASE 1 — IMPLEMENTA
Scrivi il codice richiesto. Completo, funzionante, senza placeholder.

### FASE 2 — REVISIONE CHIRURGICA (auto-review prima di consegnare)
Prima di mostrarmi il risultato, rispondi internamente a queste domande:
- [ ] Il codice compila senza errori TypeScript?
- [ ] Tutti gli import esistono e sono corretti?
- [ ] La logica del flusso utente è rispettata (Home → Scan → Loading → Result)?
- [ ] Il JSON di Claude viene parsato con gestione errori robusta?
- [ ] La UI è coerente con il design system (palette, font, animazioni)?
- [ ] Il componente funziona sia su tablet che su mobile?
- [ ] I testi sono presenti in ENTRAMBE le lingue (it + en)?
- [ ] I casi edge sono gestiti? (foto sfocata, nessun vino, errore API, timeout)

Se anche solo UNA risposta è NO → correggi prima di mostrarmi il codice.

### FASE 3 — REPORT
Dopo ogni task completato dimmi:
✅ Cosa hai fatto
⚠️ Eventuali decisioni prese (e perché)
🔜 Prossimo task consigliato

---

## TASK 01 — SETUP PROGETTO

Esegui in sequenza:

1. Installa le dipendenze:
```bash
npm install @anthropic-ai/sdk next-pwa react-i18next i18next i18next-resources-to-backend
```

2. Crea la struttura cartelle completa:
```
/app
  /scan/page.tsx
  /result/page.tsx
  /api/analyze-wine/route.ts
/components
  CameraStream.tsx
  WineCard.tsx
  TastingNotes.tsx
  FoodPairing.tsx
  LanguageToggle.tsx
  LoadingWine.tsx
/lib
  anthropic.ts
  types.ts
  i18n.ts
/locales
  it.json
  en.json
/public
  manifest.json
  /icons (placeholder)
```

3. Crea `/lib/types.ts` con questa interfaccia ESATTA:
```typescript
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

4. Crea `/lib/anthropic.ts` con il client e buildPrompt(lang):

Il prompt da usare è questo (NON modificarlo):
---
Sei un sommelier esperto con 20 anni di esperienza nelle enoteche italiane.
Analizza attentamente l'etichetta nella foto e descrivi il vino in modo
professionale ma accessibile, come se parlassi con un cliente curioso
che non è un esperto.

Usa un linguaggio caldo, evocativo e semplice. Evita termini tecnici
senza spiegarli. Fai immaginare il vino con metafore sensoriali vivide.

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido, senza markdown,
senza testo prima o dopo. Lingua dell'output: ${outputLang}.

Schema JSON richiesto:
{
  "nome_vino": "nome completo del vino",
  "produttore": "cantina o produttore",
  "annata": "anno es. '2019' o 'N.V.' se non vintage",
  "regione": "regione di provenienza",
  "paese": "paese es. 'Italia'",
  "denominazione": "DOC / DOCG / IGT / VdT",
  "vitigni": ["es. 'Sangiovese 90%', 'Merlot 10%'"],
  "gradazione": "es. '13.5%'",
  "temperatura_servizio": "es. '16-18°C — servilo fresco per esaltare i tannini'",
  "note_visive": "colore e aspetto in modo poetico e semplice",
  "note_olfattive": "profumi descritti come odori di vita quotidiana (frutti, fiori, spezie)",
  "note_gustative": "come si sente in bocca, spiegato a chi non è esperto",
  "abbinamenti": ["3-5 piatti specifici e appetitosi"],
  "descrizione": "2-3 frasi che raccontano la personalità del vino",
  "confidenza": "alta | media | bassa | nulla"
}

Se non è leggibile o non è vino: confidenza 'nulla', spiega in 'descrizione'.
---

5. Crea `/app/api/analyze-wine/route.ts`:
- Accetta POST con { imageBase64: string, lang: "it" | "en" }
- Comprime l'immagine? No, la compressione avviene lato client
- Chiama Claude claude-sonnet-4-20250514 con vision
- Estrae JSON con regex /\{[\s\S]*\}/ come fallback sicuro
- Ritorna 422 se confidenza è "nulla" o JSON non parsabile
- Timeout gestito con try/catch

6. Crea i file di localizzazione `/locales/it.json` e `/locales/en.json`:

it.json:
```json
{
  "home": {
    "headline": "Scopri ogni bottiglia",
    "subheadline": "Fotografa un vino, il nostro sommelier AI ti racconta tutto",
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
      "Il sommelier sta annusando...",
      "Consultando la cantina...",
      "Decifrando l'annata...",
      "Abbinando i sapori..."
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
    },
    "confidence": {
      "alta": "Analisi certa",
      "media": "Analisi probabile",
      "bassa": "Analisi incerta",
      "nulla": "Bottiglia non riconosciuta"
    }
  },
  "error": {
    "not_recognized": "Non riesco a leggere questa etichetta",
    "retry": "Riprova con una foto più nitida",
    "api_error": "Errore di connessione, riprova"
  }
}
```

en.json: traduci gli stessi campi in inglese.

7. Configura `/lib/i18n.ts` con react-i18next, lingua default IT, toggle manuale.

8. Crea `next.config.js` con next-pwa:
- disabled in development
- dest: "public"

9. Crea `public/manifest.json`:
```json
{
  "name": "Enoteca Nocchia",
  "short_name": "Nocchia",
  "description": "Il tuo sommelier AI tascabile",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "portrait",
  "background_color": "#0a0a0a",
  "theme_color": "#8B1A1A"
}
```

10. Aggiungi in `app/layout.tsx`:
- Font Google: Playfair Display (700) + DM Sans (400, 500)
- CSS variables globali nel :root:
  --color-bg: #0a0a0a
  --color-surface: #141414
  --color-border: #2a2a2a
  --color-gold: #C9A84C
  --color-bordeaux: #8B1A1A
  --color-text: #F5F0E8
  --color-muted: #888880
- Meta tag PWA: theme-color, viewport, apple-mobile-web-app
- Link al manifest.json

11. Crea `.env.local.example`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## IMPORTANTE
- NON creare UI ancora (la facciamo nel task 02)
- Ogni file deve essere completo e funzionante
- Niente placeholder tipo "// TODO" o "// implement later"
- Se hai dubbi su un'implementazione, scegli la più robusta e documentala nel report

Inizia ora. Segui il loop IMPLEMENTA → REVISIONE → REPORT.
```

---

## PROMPT 02 (da usare dopo) — HOME + SCAN UI
Usa questo come secondo prompt una volta completato il Task 01.

```
Task 02 — UI: Home Page + Camera Stream

Segui sempre il loop: IMPLEMENTA → REVISIONE CHIRURGICA → REPORT.

### Crea `app/page.tsx` — Home Page

Design: dark elegante, Playfair Display per il titolo, centrata verticalmente.
- Logo testuale "Enoteca Nocchia" in oro (font Playfair Display, grande)
- Sottotitolo dal locale (home.subheadline)
- Pulsante CTA bordeaux con bordo gold, testo oro: "📷 Fotografa la bottiglia"
- Navigates a /scan
- LanguageToggle in alto a destra (IT | EN)
- Animazione fade-in staggered all'entrata (CSS keyframes)
- Sfondo: #0a0a0a con texture noise SVG sottile sovrapposta (opacity 0.03)

### Crea `components/LanguageToggle.tsx`
- Pulsante "IT | EN" in alto a destra
- Stile: testo muted, quello attivo in gold
- Cambia lingua globale via i18n

### Crea `app/scan/page.tsx` + `components/CameraStream.tsx`

CameraStream.tsx:
- Avvia getUserMedia({ video: { facingMode: "environment" } })
- Stream video a schermo intero (object-fit: cover)
- Overlay semi-trasparente con cornice guida rettangolare al centro
  (bordo gold tratteggiato animato, angoli arrotondati)
- Testo sotto la cornice: "Inquadra l'etichetta" (dal locale)

scan/page.tsx:
- Mostra CameraStream
- Pulsante scatto in basso al centro (cerchio bianco 72px, shadow gold)
- Al click: cattura frame dal video su canvas, comprimi a max 1000px width,
  qualità 0.8, converti in base64 JPEG
- Mostra preview dell'immagine catturata
- Sotto la preview: "Analizza" (bordeaux) | "Riprendi" (ghost)
- "Analizza": POST /api/analyze-wine con { imageBase64, lang }
- Durante chiamata: naviga a /result con state (o localStorage temporaneo)
- Gestisci permesso camera negato: mostra messaggio elegante

### Crea `components/LoadingWine.tsx`
- Spinner ring dorato CSS
- Messaggio random che cambia ogni 2s (da loading.messages nel locale)
- Fade in/out tra i messaggi

Segui il loop. Report completo alla fine.
```

---

## PROMPT 03 (da usare dopo) — RESULT PAGE

```
Task 03 — UI: Result Page + WineCard

Segui sempre il loop: IMPLEMENTA → REVISIONE CHIRURGICA → REPORT.

### Crea `app/result/page.tsx`
- Legge i dati WineAnalysis da localStorage (key: "lastWineAnalysis")
- Se confidenza === "nulla": mostra schermata errore elegante con pulsante riprova
- Altrimenti: mostra WineCard con animazione staggered (ogni sezione appare con delay 150ms)
- In alto: badge confidenza (alta=verde, media=giallo, bassa=arancio)
- In fondo: pulsante "Analizza un'altra bottiglia" → torna a /scan

### Crea `components/WineCard.tsx`
Struttura a sezioni (usa i CSS vars del design system):

HEADER:
- Nome vino (Playfair Display, grande, color: gold)
- Produttore + Annata (muted)
- Regione | Denominazione | Vitigni (badge pillola bordo gold)
- Gradazione alcolica

SEZIONE "descrizione":
- Testo in corsivo, colore text, bordo sinistro bordeaux, padding left

SEZIONE "All'occhio" (👁):
- note_visive

SEZIONE "Al naso" (🌸):
- note_olfattive

SEZIONE "In bocca" (👅):
- note_gustative

SEZIONE "Temperatura di servizio" (🌡):
- temperatura_servizio
- Card con sfondo surface, bordo gold sottile

SEZIONE "Si abbina con" (🍽):
- Lista abbinamenti come chip/badge bordeaux

### Crea `components/TastingNotes.tsx`
Componente riusabile per le 3 note sensoriali con icona, titolo, testo.

### Crea `components/FoodPairing.tsx`
Lista di chip per gli abbinamenti.

Segui il loop. Report completo alla fine.
```
