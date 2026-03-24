import { NextRequest, NextResponse } from "next/server";
import { anthropicClient, buildPrompt } from "@/lib/anthropic";
import { BilingualWineAnalysis } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = (await req.json()) as {
      imageBase64: string;
    };

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Immagine mancante" },
        { status: 400 }
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

    const wineData: BilingualWineAnalysis = JSON.parse(jsonMatch[0]);

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
