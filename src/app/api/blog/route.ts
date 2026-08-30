import { NextRequest, NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, textOf } from "@/lib/anthropic";
import type { BrandVoice } from "@/lib/types";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

interface Body {
  topic: string;
  keyword: string;
  length: "short" | "medium" | "long";
  brand: BrandVoice;
  /** Optional website + audit context so the post reflects the real business. */
  context?: string;
}

interface BlogPost {
  title: string;
  metaDescription: string;
  slug: string;
  html: string;
  keywords: string[];
}

const WORDS: Record<Body["length"], string> = {
  short: "400–600 words",
  medium: "700–1000 words",
  long: "1200–1600 words",
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function systemPrompt(brand: BrandVoice, length: Body["length"]): string {
  return [
    `You are an expert SEO content writer for "${brand.businessName}", a ${brand.businessType} in ${brand.city}.`,
    `Write a blog post that helps this business rank higher on Google for local searches.`,
    ``,
    `Return ONLY valid JSON (no markdown fence) with this exact shape:`,
    `{"title": string, "metaDescription": string (140-160 chars), "slug": string (kebab-case), "html": string, "keywords": string[]}`,
    ``,
    `The "html" is the article body as clean semantic HTML using <h2>, <h3>, <p>, <ul>, <li> — no <html>/<head>/<body> wrapper, no inline styles.`,
    `Length: ${WORDS[length]}.`,
    `Voice: ${brand.tone}, helpful and genuine — never robotic or obviously AI.`,
    `Weave in the target keyword and the city "${brand.city}" naturally in the title, first paragraph, and one H2. Never keyword-stuff.`,
    brand.keywords.length ? `Related phrases to use where natural: ${brand.keywords.join("; ")}.` : ``,
    `Open with a hook, give genuinely useful, specific advice, and end with a soft call to action to visit or contact ${brand.businessName}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function fallbackPost(topic: string, keyword: string, brand: BrandVoice): BlogPost {
  const kw = keyword.trim() || topic;
  const title = `${topic} — A Local Guide from ${brand.businessName}`;
  return {
    title,
    metaDescription: `${brand.businessName} in ${brand.city} shares a practical guide to ${kw.toLowerCase()}. Tips, insights, and how we can help.`.slice(0, 158),
    slug: slugify(title),
    keywords: [kw, `${brand.businessType} ${brand.city}`, ...brand.keywords].slice(0, 6),
    html: `<p>Looking for ${kw} in ${brand.city}? At ${brand.businessName}, this is something we help people with every day. Here's what actually matters.</p>
<h2>Why ${topic} matters</h2>
<p>Getting this right saves you time and money — and it's simpler than most people think. Below are the practical points we share with our own customers.</p>
<h2>Our top tips</h2>
<ul>
<li>Start with the basics and don't overcomplicate it.</li>
<li>Ask a local expert before making a big decision.</li>
<li>Consistency beats intensity — small steps add up.</li>
</ul>
<h2>How ${brand.businessName} can help</h2>
<p>We're proud to serve ${brand.city} and would love to help you with ${kw.toLowerCase()}. Stop by or reach out — we're always happy to chat.</p>`,
  };
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { topic, keyword, length, brand, context } = body;
  if (!topic?.trim()) return NextResponse.json({ error: "Enter a topic." }, { status: 400 });

  if (!hasApiKey) {
    return NextResponse.json({ post: fallbackPost(topic, keyword, brand), source: "fallback" });
  }

  const userMsg = [
    context ? `About this business (from their website):\n${context}\n` : "",
    `Topic: ${topic}`,
    `Target keyword: ${keyword || topic}`,
    ``,
    `Write the post as JSON.`,
  ].join("\n");

  try {
    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "medium" },
      system: systemPrompt(brand, length),
      messages: [{ role: "user", content: userMsg }],
    });
    const raw = textOf(message).replace(/^```json\s*|\s*```$/g, "").trim();
    let post: BlogPost;
    try {
      post = JSON.parse(raw);
    } catch {
      return NextResponse.json({ post: fallbackPost(topic, keyword, brand), source: "fallback", note: "AI output could not be parsed; showing a template." });
    }
    if (!post.slug) post.slug = slugify(post.title || topic);
    return NextResponse.json({ post, source: "ai" });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return NextResponse.json({ error: "Rate limited — try again shortly." }, { status: 429 });
    return NextResponse.json({ post: fallbackPost(topic, keyword, brand), source: "fallback" });
  }
}
