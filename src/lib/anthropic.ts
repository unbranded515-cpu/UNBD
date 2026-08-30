import Anthropic from "@anthropic-ai/sdk";

/**
 * Central Claude client + config.
 *
 * The app is designed to run *without* a key too: every AI route falls back to
 * a sensible template so you can demo the product before wiring billing. When
 * ANTHROPIC_API_KEY is set, the real model takes over automatically.
 */

export const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);

// Default to the highest-quality model. Override with ANTHROPIC_MODEL — for
// high-volume review replies, claude-sonnet-5 or claude-haiku-4-5 cut cost a lot
// while staying strong on short text. See .env.example.
export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

/** Pull the plain text out of a Messages response. */
export function textOf(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
