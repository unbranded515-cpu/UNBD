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

  async function generate() {
    if (!topic.trim() || !active) return;
    setBusy(true); setError(""); setNote(""); setPost(null);
    // Give the model real context about this brand's website.
    const context = [
      active.website ? `Website: ${active.website}` : "",
      active.description ? `About: ${active.description}` : "",
      active.audit?.summary ? `SEO note: ${active.audit.summary}` : "",
    ].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, keyword, length, brand: active, context }) });
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
      <p className="mt-2 text-ink2">Posts written in {active.businessName}&apos;s voice{active.website ? ", informed by their website" : ""}.</p>

      <div className="card mt-6">
        <label className="label">What should the post be about?</label>
        <input className="inp" placeholder="e.g. How to choose the right coffee beans" value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()} />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><label className="label">Target keyword (optional)</label><input className="inp" placeholder={active.keywords?.[0] || "best coffee beans Austin"} value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
          <div><label className="label">Length</label><select className="inp" value={length} onChange={(e) => setLength(e.target.value as typeof length)}><option value="short">Short (~500 words)</option><option value="medium">Medium (~850 words)</option><option value="long">Long (~1400 words)</option></select></div>
        </div>
        <div className="mt-4"><button className="btn-primary" onClick={generate} disabled={busy}>{busy ? "Writing…" : "Generate post"}</button></div>
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>

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
