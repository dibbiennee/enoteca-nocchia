import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, buildPrompt } from "@/lib/anthropic";
import { BilingualWineAnalysis } from "@/lib/types";
import { rateLimit } from "@/lib/rate-limit";

const MAX_BASE64_LENGTH = 10_000_000; // ~7.5MB decoded

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 15 requests per minute per IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!rateLimit(ip, 15)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra un minuto." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const imageBase64 = body?.imageBase64 as string | undefined;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "Immagine mancante" },
        { status: 400 }
      );
    }

    // Validate base64 size
    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Immagine troppo grande (max 7MB)" },
        { status: 413 }
      );
    }

    const prompt = buildPrompt();

    const response = await anthropicClient.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1600,
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

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Impossibile analizzare l'immagine" },
        { status: 422 }
      );
    }

    let wineData: BilingualWineAnalysis;
    try {
      wineData = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Risposta AI non valida" },
        { status: 422 }
      );
    }

    if (wineData.it.confidenza === "nulla") {
      return NextResponse.json(
        { error: wineData.it.descrizione, data: wineData },
        { status: 422 }
      );
    }

    return NextResponse.json(wineData);
  } catch (error) {
    console.error("Errore analisi vino:", error);
    return NextResponse.json(
      { error: "Errore durante l'analisi. Riprova." },
      { status: 500 }
    );
  }
}
