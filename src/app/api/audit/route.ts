import { NextRequest, NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, textOf } from "@/lib/anthropic";
import { analyze, fetchHtml, firstFix, isValidUrl, normalizeUrl } from "@/lib/seo";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let url: string, keyword: string;
  try {
    const b = await req.json();
    url = normalizeUrl(String(b.url || ""));
    keyword = String(b.keyword || "");
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

  const { checks, score, title } = analyze(html, url, keyword);

  let summary = "";
  if (hasApiKey) {
    try {
      const message = await getClient().messages.create({
        model: MODEL,
        max_tokens: 800,
        output_config: { effort: "low" },
        system: "You are a local SEO expert. Given a site's audit checks, write a short, plain-English action plan (max 3 sentences) telling a small-business owner the single most important thing to fix first and why it helps them rank higher on Google. No fluff, no lists.",
        messages: [{ role: "user", content: `URL: ${url}\nTarget keyword: ${keyword || "(none)"}\nScore: ${score}/100\nChecks:\n${checks.map((c) => `[${c.state}] ${c.title}: ${c.detail}`).join("\n")}` }],
      });
      summary = textOf(message);
    } catch {
      summary = "";
    }
  }
  if (!summary) summary = firstFix(checks);

  return NextResponse.json({ url, title, score, checks, summary });
}
