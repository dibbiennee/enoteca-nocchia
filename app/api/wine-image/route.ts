import { NextRequest, NextResponse } from "next/server";

async function searchBingImages(query: string, preferPng = false): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3&first=1&qft=+filterui:photo-transparent`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const matches = html.match(/murl&quot;:&quot;(https?:\/\/[^&]+)/g);
    if (!matches || matches.length === 0) return null;

    const candidates: string[] = [];
    for (const m of matches.slice(0, 12)) {
      const imgUrl = m.replace('murl&quot;:&quot;', '');
      const lower = imgUrl.toLowerCase();
      // Skip junk
      if (lower.includes("favicon") || lower.includes("logo") || lower.includes("banner")) continue;
      // Skip packs/cases
      if (lower.includes("6-bott") || lower.includes("12-bott") || lower.includes("cassa") || lower.includes("case-of") || lower.includes("pack-of")) continue;
      // Skip reflection/mirror images
      if (lower.includes("riflesso") || lower.includes("reflection") || lower.includes("mirror")) continue;
      candidates.push(imgUrl);
    }

    if (candidates.length === 0) return null;

    // Prefer .png URLs (more likely to have true transparency)
    if (preferPng) {
      const pngUrl = candidates.find(u => u.toLowerCase().endsWith(".png"));
      if (pngUrl) return pngUrl;
    }

    return candidates[0];
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Query mancante" }, { status: 400 });
  }

  // Try with "bottiglia png" for transparent background
  const imageUrl = await searchBingImages(`${query} bottiglia png`, true);

  if (imageUrl) {
    return NextResponse.json(
      { imageUrl },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  }

  // Fallback: simpler query
  const fallback = await searchBingImages(`${query} bottiglia vino`, true);
  return NextResponse.json(
    { imageUrl: fallback },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}
