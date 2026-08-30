import { NextRequest, NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, textOf } from "@/lib/anthropic";
import { sentimentForRating, type BrandVoice, type Review } from "@/lib/types";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

interface Body {
  review: Pick<Review, "author" | "rating" | "text">;
  brand: BrandVoice;
}

/**
 * Build the system prompt for the reply engine. This is where the product's
 * "sound human, on-brand, ranking-aware" behaviour lives.
 */
function systemPrompt(brand: BrandVoice): string {
  return [
    `You are the owner of "${brand.businessName}", a ${brand.businessType} in ${brand.city}.`,
    `You are replying to a Google review. Write ONLY the reply text — no quotes, no preamble, no "Reply:".`,
    ``,
    `VOICE: ${brand.tone}. Sound like a real human owner, never like a corporate bot or AI.`,
    `Vary your wording — never reuse the same opening line across reviews.`,
    ``,
    `LENGTH: 2–4 sentences. Warm, specific, and genuine.`,
    ``,
    `LOCAL SEO (do this naturally, never keyword-stuff):`,
    `- Mention the business name "${brand.businessName}" once.`,
    brand.city ? `- Reference the city/area "${brand.city}" when it fits.` : ``,
    brand.keywords.length
      ? `- If it reads naturally, work in ONE of these phrases: ${brand.keywords.join("; ")}. If none fit, skip it — never force it.`
      : ``,
    ``,
    `RULES BY SENTIMENT:`,
    `- POSITIVE (4–5★): Thank them warmly, echo a specific detail they mentioned, invite them back.`,
    `- NEUTRAL (3★): Thank them, acknowledge the gap, briefly note you'd love to do better.`,
    `- NEGATIVE (1–2★): Lead with sincere empathy, apologize without excuses, DO NOT argue or blame. Take it offline — invite them to reach out directly so you can make it right. Never admit legal fault; stay gracious.`,
    ``,
    brand.notes ? `BUSINESS NOTES (honor these): ${brand.notes}` : ``,
    brand.signOff ? `SIGN OFF with: "${brand.signOff}"` : ``,
    ``,
    `Never fabricate facts (discounts, refunds, names) that you weren't told. Comply with Google review policies.`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Deterministic fallback when there's no API key — keeps the app demoable. */
function fallbackReply(review: Body["review"], brand: BrandVoice): string {
  const s = sentimentForRating(review.rating);
  const kw = brand.keywords[0] ? ` for our ${brand.keywords[0]}` : "";
  if (s === "positive") {
    return `Thank you so much, ${review.author.split(" ")[0]}! We're thrilled you enjoyed your visit to ${brand.businessName}${kw}. It means the world to the whole team — we can't wait to welcome you back soon. ${brand.signOff}`;
  }
  if (s === "neutral") {
    return `Thanks for the honest feedback, ${review.author.split(" ")[0]}. We're glad you stopped by ${brand.businessName}, and we'd love the chance to make your next visit a 5-star one. ${brand.signOff}`;
  }
  return `${review.author.split(" ")[0]}, we're truly sorry your experience at ${brand.businessName} fell short — that's not the standard we hold ourselves to. We'd really like to make this right; please reach out to us directly so we can fix it. ${brand.signOff}`;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { review, brand } = body;
  if (!review || typeof review.rating !== "number" || !review.text) {
    return NextResponse.json({ error: "Missing review fields." }, { status: 400 });
  }

  const sentiment = sentimentForRating(review.rating);

  // No key → template fallback so the product still works end-to-end.
  if (!hasApiKey) {
    return NextResponse.json({
      reply: fallbackReply(review, brand),
      sentiment,
      source: "fallback",
    });
  }

  try {
    const message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      system: systemPrompt(brand),
      messages: [
        {
          role: "user",
          content: `New ${review.rating}★ Google review from ${review.author}:\n\n"${review.text}"\n\nWrite the reply.`,
        },
      ],
    });
    return NextResponse.json({ reply: textOf(message), sentiment, source: "ai" });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid ANTHROPIC_API_KEY.", sentiment, reply: fallbackReply(review, brand), source: "fallback" },
        { status: 200 },
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limited — try again shortly." }, { status: 429 });
    }
    const msg = err instanceof Anthropic.APIError ? err.message : "Generation failed.";
    return NextResponse.json({ error: msg, sentiment, reply: fallbackReply(review, brand), source: "fallback" }, { status: 200 });
  }
}
