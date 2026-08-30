import { NextRequest, NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, textOf } from "@/lib/anthropic";
import { aeoChecks, analyze, fetchHtml, firstFix, guessName, isValidUrl, normalizeUrl } from "@/lib/seo";

export const runtime = "nodejs";

/**
 * Front-door endpoint: take a website URL, pull it, and return everything a
 * new brand needs — auto-filled profile fields + a saved SEO audit.
 */
export async function POST(req: NextRequest) {
  let url: string;
  try {
    url = normalizeUrl(String((await req.json()).url || ""));
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!isValidUrl(url)) return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });

  let html = "";
  try {
    html = await fetchHtml(url);
  } catch {
    return NextResponse.json({ error: "Couldn't reach that site. Check the URL and that it's online." }, { status: 200 });
  }

  const audit = analyze(html, url, "");
  const summary = firstFix(audit.checks);
  const fallbackName = guessName(html, url);
  const aeo = aeoChecks(html, fallbackName);

  // Default profile (used as-is when there's no API key).
  let profile = {
    businessName: fallbackName,
    businessType: "Local business",
    city: "",
    keywords: [] as string[],
    description: "",
    tone: "Warm & friendly",
  };

  if (hasApiKey) {
    try {
      // Trim the page text to keep the request small.
      const text = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 6000);
      const message = await getClient().messages.create({
        model: MODEL,
        max_tokens: 700,
        output_config: { effort: "low" },
        system:
          "You extract a small-business profile from its website text. Return ONLY valid JSON (no fence): {\"businessName\": string, \"businessType\": string, \"city\": string, \"keywords\": string[3 local SEO phrases], \"description\": string (one sentence), \"tone\": one of \"Warm & friendly\"|\"Professional\"|\"Playful\"|\"Luxury & refined\"|\"Straight-talking\"}. If a field is unknown, use an empty string (or [] for keywords).",
        messages: [{ role: "user", content: `Website: ${url}\n\nPage text:\n${text}` }],
      });
      const raw = textOf(message).replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(raw);
      profile = {
        businessName: parsed.businessName || fallbackName,
        businessType: parsed.businessType || "Local business",
        city: parsed.city || "",
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 4) : [],
        description: parsed.description || "",
        tone: parsed.tone || "Warm & friendly",
      };
    } catch {
      /* keep fallback profile */
    }
  }

  return NextResponse.json({
    url,
    profile,
    audit: { score: audit.score, title: audit.title, summary, checks: audit.checks, aeo },
    source: hasApiKey ? "ai" : "fallback",
  });
}
