import { NextRequest, NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, textOf } from "@/lib/anthropic";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

type CheckState = "good" | "warn" | "bad";
interface Check {
  state: CheckState;
  title: string;
  detail: string;
}

function normalizeUrl(raw: string): string {
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}

function extract(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

/** Analyze fetched HTML for on-page SEO signals that affect local ranking. */
function analyze(html: string, url: string, keyword: string): { checks: Check[]; score: number; title: string | null } {
  const checks: Check[] = [];
  const isHttps = url.startsWith("https://");
  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const h1Count = (html.match(/<h1[\b >]/gi) || []).length;
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgsNoAlt = imgs.filter((t) => !/\balt=/i.test(t)).length;
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasSchema = /application\/ld\+json/i.test(html);
  const hasOg = /property=["']og:/i.test(html);
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  const words = (textOnly.match(/\b\w+\b/g) || []).length;
  const kw = keyword.trim().toLowerCase();
  const kwInTitle = kw && title ? title.toLowerCase().includes(kw) : false;
  const kwInBody = kw ? textOnly.toLowerCase().includes(kw) : false;

  const add = (state: CheckState, t: string, d: string) => checks.push({ state, title: t, detail: d });

  add(isHttps ? "good" : "bad", "HTTPS secure", isHttps ? "Your site loads securely over HTTPS." : "Not served over HTTPS. Google demotes and flags insecure sites — add an SSL certificate.");
  add(hasViewport ? "good" : "bad", "Mobile-friendly", hasViewport ? "A responsive viewport tag is present." : "No mobile viewport tag. 60%+ of local searches are on phones — make the site responsive.");
  add(title ? (title.length >= 20 && title.length <= 65 ? "good" : "warn") : "bad", "Title tag", title ? `“${title}” (${title.length} chars).${title.length > 65 ? " Slightly long — keep under 60." : ""}` : "Missing <title>. This is the biggest on-page ranking signal.");
  add(metaDesc ? "good" : "warn", "Meta description", metaDesc ? "Present — good for click-through from search." : "No meta description. Add a compelling 140–160 char summary to win more clicks.");
  add(kw ? (kwInTitle ? "good" : "warn") : "warn", "Keyword targeting", !kw ? "Add your target keyword to compare against the page." : kwInTitle ? `“${keyword}” appears in your title — strong signal.` : kwInBody ? `“${keyword}” is in the page but not the title. Add it to the <title> and an <h1>.` : `“${keyword}” doesn't appear on the page. Google has to guess what you rank for — add it to the title, H1, and body.`);
  add(h1Count === 1 ? "good" : "warn", "Heading structure", h1Count === 1 ? "Exactly one <h1> — ideal." : h1Count === 0 ? "No <h1> found. Add one clear headline with your main service + city." : `${h1Count} <h1> tags. Use just one primary headline.`);
  add(words >= 300 ? "good" : "warn", "Content depth", words >= 300 ? `~${words} words of content — enough for Google to understand the page.` : `Only ~${words} words. Thin pages struggle to rank; aim for 300+ describing your services and area.`);
  add(hasSchema ? "good" : "warn", "Structured data", hasSchema ? "JSON-LD schema detected — helps rich results." : "No LocalBusiness schema. Add JSON-LD with your name, address, phone & hours for local results.");
  add(imgsNoAlt === 0 && imgs.length > 0 ? "good" : imgs.length === 0 ? "warn" : "warn", "Image alt text", imgs.length === 0 ? "No images found." : imgsNoAlt === 0 ? "All images have alt text." : `${imgsNoAlt} of ${imgs.length} images missing alt text — hurts accessibility and image SEO.`);
  add(hasCanonical || hasOg ? "good" : "warn", "Sharing & canonical", hasCanonical || hasOg ? "Canonical/Open Graph tags present." : "No canonical or Open Graph tags. Add them for clean sharing and to avoid duplicate-content issues.");

  const good = checks.filter((c) => c.state === "good").length;
  const warn = checks.filter((c) => c.state === "warn").length;
  const score = Math.max(15, Math.min(98, Math.round((good * 100) / checks.length - warn * 2 + (isHttps ? 4 : 0))));
  return { checks, score, title };
}

export async function POST(req: NextRequest) {
  let url: string, keyword: string;
  try {
    const b = await req.json();
    url = normalizeUrl(String(b.url || ""));
    keyword = String(b.keyword || "");
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!/^https?:\/\/[^ ]+\.[^ ]+/.test(url)) {
    return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });
  }

  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; UnbrandedBot/1.0; +https://unbranded.ai)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `The site returned HTTP ${res.status}. Check the URL is public.` }, { status: 200, });
    }
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Couldn't reach that site. Check the URL and that it's online." }, { status: 200 });
  }

  const { checks, score, title } = analyze(html, url, keyword);

  // Optional: an AI-written priority action plan on top of the computed checks.
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
  if (!summary) {
    const firstBad = checks.find((c) => c.state === "bad") || checks.find((c) => c.state === "warn");
    summary = firstBad ? `Start here: ${firstBad.title.toLowerCase()} — ${firstBad.detail}` : "Great foundation — keep publishing fresh, keyword-focused content and gathering Google reviews.";
  }

  return NextResponse.json({ url, title, score, checks, summary });
}
