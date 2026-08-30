// Shared domain types for Unbranded.

export type Sentiment = "positive" | "neutral" | "negative";

export interface Review {
  id: string;
  author: string;
  rating: number; // 1–5
  text: string;
  date: string; // ISO or human string
  replied?: boolean;
  reply?: string;
}

/**
 * The business's voice profile. This is what makes replies sound human and
 * on-brand, and what weaves ranking keywords in naturally.
 */
export interface BrandVoice {
  businessName: string;
  businessType: string;
  city: string;
  /** e.g. "Warm & friendly", "Professional", "Playful" */
  tone: string;
  /** Local keywords to work in naturally for SEO, e.g. ["best coffee in Austin", "oat milk latte"] */
  keywords: string[];
  /** How replies sign off, e.g. "— The team at Rosa's Café" */
  signOff: string;
  /** Anything else: policies, things to always/never say */
  notes: string;
}

export const DEFAULT_BRAND: BrandVoice = {
  businessName: "Rosa's Café",
  businessType: "Cafe / Restaurant",
  city: "Austin, TX",
  tone: "Warm & friendly",
  keywords: ["best coffee in Austin", "cozy café", "oat milk latte"],
  signOff: "— The team at Rosa's Café ☕",
  notes: "Family-owned since 2015. We always invite unhappy guests to reach us at hello@rosascafe.com so we can make it right.",
};

export function sentimentForRating(rating: number): Sentiment {
  if (rating >= 4) return "positive";
  if (rating === 3) return "neutral";
  return "negative";
}
