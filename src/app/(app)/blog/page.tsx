"use client";

import { useState } from "react";
import Link from "next/link";
import { useBrandsCtx } from "@/components/BrandsProvider";

interface BlogPost { title: string; metaDescription: string; slug: string; html: string; keywords: string[]; }

export default function BlogPage() {
  const { active, ready } = useBrandsCtx();
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [post, setPost] = useState<BlogPost | null>(null);

  async function generate(auto: boolean) {
    if (!active) return;
    if (!auto && !topic.trim()) return;
    setBusy(true); setError(""); setNote(""); setPost(null);
    // Give the model real context about this brand's website.
    const context = [
      active.website ? `Website: ${active.website}` : "",
      `Business: ${active.businessName} — ${active.businessType}${active.city ? `, ${active.city}` : ""}`,
      active.description ? `About: ${active.description}` : "",
      active.keywords?.length ? `Keywords they care about: ${active.keywords.join(", ")}` : "",
      active.audit?.summary ? `SEO note: ${active.audit.summary}` : "",
    ].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, keyword, length, brand: active, context, auto }) });
      const data = await res.json();
      if (data.post) {
        setPost(data.post);
        if (data.source === "fallback") setNote("Preview draft — add ANTHROPIC_API_KEY for full AI posts.");
        if (data.note) setNote(data.note);
      } else setError(data.error || "Couldn't generate a post.");
    } catch { setError("Network error — please try again."); }
    finally { setBusy(false); }
  }

  function copyHtml() {
    if (!post) return;
    const full = `<h1>${post.title}</h1>\n${post.html}`;
    const ta = document.createElement("textarea");
    ta.value = full; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); setNote("HTML copied ✓ — paste into your website editor."); } catch { setNote("Select the HTML and copy manually."); }
    document.body.removeChild(ta);
  }

  function download() {
    if (!post) return;
    const doc = `<!doctype html><html><head><meta charset="utf-8"><title>${post.title}</title><meta name="description" content="${post.metaDescription}"></head><body><h1>${post.title}</h1>\n${post.html}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([doc], { type: "text/html" }));
    a.download = `${post.slug || "blog-post"}.html`; a.click(); URL.revokeObjectURL(a.href);
  }

  if (!ready) return <div className="px-6 py-16 text-center text-muted">Loading…</div>;
  if (!active) return <div className="mx-auto max-w-xl px-6 py-16 text-center"><h1 className="font-display text-2xl font-extrabold">No brand selected</h1><p className="mt-2 text-ink2">Add a brand from the <Link href="/dashboard" className="font-semibold text-coralink hover:underline">home page</Link> first.</p></div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <span className="eyebrow">Blog writer · {active.businessName}</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">AI blogs that help you rank</h1>
      <p className="mt-2 text-ink2">Let AI do it all — it reads {active.businessName}&apos;s{active.website ? " website" : " details"}, picks the topic and keywords, and writes the post.</p>

      {/* One-click, zero-input auto blog */}
      <div className="card mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h3 className="font-display text-lg font-extrabold">Generate a blog automatically</h3>
          <p className="text-sm text-ink2">No typing needed. AI chooses the best topic + keywords for {active.businessName} and writes the whole post.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="inp !w-auto" value={length} onChange={(e) => setLength(e.target.value as typeof length)}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select>
          <button className="btn-primary flex-none" onClick={() => generate(true)} disabled={busy}>{busy ? "Writing…" : "✨ Generate blog"}</button>
        </div>
      </div>

      {/* Optional manual topic */}
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-coralink">Or write about a specific topic →</summary>
        <div className="card mt-2">
          <label className="label">What should the post be about?</label>
          <input className="inp" placeholder="e.g. How to choose the right coffee beans" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate(false)} />
          <div className="mt-3"><label className="label">Target keyword (optional — AI picks one if blank)</label><input className="inp" placeholder={active.keywords?.[0] || "best coffee beans Austin"} value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
          <div className="mt-4"><button className="btn-ghost" onClick={() => generate(false)} disabled={busy}>{busy ? "Writing…" : "Generate this topic"}</button></div>
        </div>
      </details>
      {error && <p className="mt-3 text-sm text-bad">{error}</p>}

      {post && (
        <div className="card mt-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-extrabold">{post.title}</h2>
              <p className="mt-1 text-sm text-muted">{post.metaDescription}</p>
              <p className="mt-1 font-mono text-xs text-coralink">/{post.slug}</p>
            </div>
            <div className="flex flex-none gap-2">
              <button className="btn-ghost !py-2 !text-xs" onClick={copyHtml}>Copy HTML</button>
              <button className="btn-dark !py-2 !text-xs" onClick={download}>Download .html</button>
            </div>
          </div>
          {note && <p className="mt-3 text-xs text-warn">{note}</p>}
          {post.keywords?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{post.keywords.map((k) => <span key={k} className="rounded-md border border-line bg-surface2 px-2 py-1 font-mono text-xs text-ink2">{k}</span>)}</div>}
          <article className="prose-unbranded mt-5" dangerouslySetInnerHTML={{ __html: post.html }} />
          <div className="mt-6 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink2"><b className="text-ink">Publish:</b> copy the HTML into WordPress/Shopify/Webflow, or download it.</div>
        </div>
      )}
    </div>
  );
}
