// Shared website fetch + on-page SEO analysis (server-side).

export type CheckState = "good" | "warn" | "bad";
export interface Check {
  state: CheckState;
  title: string;
  detail: string;
}

export function normalizeUrl(raw: string): string {
  let u = (raw || "").trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}

export function isValidUrl(url: string): boolean {
  return /^https?:\/\/[^ ]+\.[^ ]+/.test(url);
}

function extract(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

export async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; UnbrandedBot/1.0; +https://unbranded.ai)" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

/** Pull a likely business name from the HTML (og:site_name → title → domain). */
export function guessName(html: string, url: string): string {
  const site = extract(html, /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
  if (site) return site;
  const title = extract(html, /<title[^>]*>([^<]*)<\/title>/i);
  if (title) return title.split(/[|\-–—:·]/)[0].trim();
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

export function analyze(html: string, url: string, keyword: string): { checks: Check[]; score: number; title: string | null } {
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
  add(kw ? (kwInTitle ? "good" : "warn") : "warn", "Keyword targeting", !kw ? "Set a target keyword to check the page against it." : kwInTitle ? `“${keyword}” appears in your title — strong signal.` : kwInBody ? `“${keyword}” is in the page but not the title. Add it to the <title> and an <h1>.` : `“${keyword}” doesn't appear on the page. Add it to the title, H1, and body.`);
  add(h1Count === 1 ? "good" : "warn", "Heading structure", h1Count === 1 ? "Exactly one <h1> — ideal." : h1Count === 0 ? "No <h1> found. Add one clear headline with your main service + city." : `${h1Count} <h1> tags. Use just one primary headline.`);
  add(words >= 300 ? "good" : "warn", "Content depth", words >= 300 ? `~${words} words of content — enough for Google to understand the page.` : `Only ~${words} words. Thin pages struggle to rank; aim for 300+ describing your services and area.`);
  add(hasSchema ? "good" : "warn", "Structured data", hasSchema ? "JSON-LD schema detected — helps rich results." : "No LocalBusiness schema. Add JSON-LD with your name, address, phone & hours for local results.");
  add(imgsNoAlt === 0 && imgs.length > 0 ? "good" : "warn", "Image alt text", imgs.length === 0 ? "No images found." : imgsNoAlt === 0 ? "All images have alt text." : `${imgsNoAlt} of ${imgs.length} images missing alt text — hurts accessibility and image SEO.`);
  add(hasCanonical || hasOg ? "good" : "warn", "Sharing & canonical", hasCanonical || hasOg ? "Canonical/Open Graph tags present." : "No canonical or Open Graph tags. Add them for clean sharing and to avoid duplicate-content issues.");

  const good = checks.filter((c) => c.state === "good").length;
  const warn = checks.filter((c) => c.state === "warn").length;
  const score = Math.max(15, Math.min(98, Math.round((good * 100) / checks.length - warn * 2 + (isHttps ? 4 : 0))));
  return { checks, score, title };
}

/**
 * "AI visibility" (AEO/GEO) checks — how likely AI assistants like ChatGPT,
 * Claude, and Gemini are to understand and recommend this business.
 */
export function aeoChecks(html: string, name: string): Check[] {
  const checks: Check[] = [];
  const lower = html.toLowerCase();
  const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ");
  const words = (textOnly.match(/\b\w+\b/g) || []).length;
  const hasSchema = /application\/ld\+json/i.test(html);
  const hasFaq = /faq|frequently asked|<h[23][^>]*>[^<]*\?/i.test(lower);
  const hasAbout = /about us|who we are|our story|about-us/.test(lower);
  const hasPhone = /(\+?\d[\d\s().-]{7,}\d)/.test(textOnly);
  const hasHours = /hours|open\s|mon|monday|opening times/.test(lower);

  const add = (state: CheckState, t: string, d: string) => checks.push({ state, title: t, detail: d });

  add(hasSchema ? "good" : "bad", "Machine-readable facts", hasSchema ? "Structured data is present — AI can read your business facts directly." : "No structured data (schema). Add LocalBusiness JSON-LD so ChatGPT, Claude & Gemini can quote your name, address, hours and services accurately.");
  add(hasAbout && words >= 300 ? "good" : "warn", "Clear, factual description", hasAbout && words >= 300 ? "You describe who you are and what you offer in plain language — exactly what AI models cite." : "AI assistants recommend businesses whose pages plainly state who you are, what you sell, and who you serve. Add a clear About + services section.");
  add(hasFaq ? "good" : "warn", "Question-and-answer content", hasFaq ? "FAQ-style content detected — AI loves pulling answers from these." : "Add an FAQ answering the real questions customers ask. AI assistants lift answers straight from FAQ content.");
  add(hasPhone && hasHours ? "good" : "warn", "Contact details & hours", hasPhone && hasHours ? "Phone and hours are on the page — AI can surface them." : "Make your phone, address and opening hours obvious on the page so AI can confidently share them.");
  add("warn", "Presence on trusted sources", `AI models trust businesses mentioned across the web. Get ${name || "your business"} listed on Google, Yelp, Apple Maps, and relevant local directories, and earn a few local press/blog mentions.`);
  add("warn", "Reviews AI can see", "Strong, recent reviews shape what AI recommends. Keep gathering Google reviews and reply to them — a job Unbranded automates for you.");

  return checks;
}

export function firstFix(checks: Check[]): string {
  const c = checks.find((x) => x.state === "bad") || checks.find((x) => x.state === "warn");
  return c ? `Start here: ${c.title.toLowerCase()} — ${c.detail}` : "Great foundation — keep publishing fresh, keyword-focused content and gathering Google reviews.";
}
