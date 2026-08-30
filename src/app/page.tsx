"use client";

import { useState } from "react";
import Link from "next/link";
import { useBrandsCtx } from "@/components/BrandsProvider";
import { emptyBrand, type AuditData } from "@/lib/brands";

function Onboarding() {
  const { addBrand } = useBrandsCtx();
  const [mode, setMode] = useState<"website" | "manual">("website");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState({ name: "", type: "Local business", city: "", phone: "", address: "" });

  async function analyzeAndAdd() {
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      const audit: AuditData = data.audit;
      const p = data.profile;
      addBrand(emptyBrand({
        businessName: p.businessName, businessType: p.businessType || "Local business", city: p.city,
        keywords: p.keywords || [], description: p.description || "", tone: p.tone || "Warm & friendly",
        signOff: p.businessName ? `— The team at ${p.businessName}` : "", website: data.url, audit,
      }));
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  function addManual() {
    if (!manual.name.trim()) { setError("Enter the business name."); return; }
    addBrand(emptyBrand({ businessName: manual.name.trim(), businessType: manual.type, city: manual.city.trim(), phone: manual.phone.trim(), address: manual.address.trim(), signOff: `— The team at ${manual.name.trim()}` }));
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="text-center">
        <span className="grid mx-auto mb-5 h-12 w-12 place-items-center rounded-xl bg-ink text-paper">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Add your first brand</h1>
        <p className="mt-2 text-ink2">Enter a client&apos;s website and we&apos;ll pull everything we need — name, keywords, and what to improve. No website? Add it by hand.</p>
      </div>

      <div className="card mt-8">
        <div className="mb-4 inline-flex rounded-lg border border-line p-1 text-sm">
          <button className={`rounded-md px-3 py-1.5 font-semibold ${mode === "website" ? "bg-coral text-white" : "text-ink2"}`} onClick={() => setMode("website")}>From website</button>
          <button className={`rounded-md px-3 py-1.5 font-semibold ${mode === "manual" ? "bg-coral text-white" : "text-ink2"}`} onClick={() => setMode("manual")}>Add manually</button>
        </div>

        {mode === "website" ? (
          <>
            <label className="label">Business website</label>
            <input className="inp" placeholder="yourclient.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyzeAndAdd()} autoFocus />
            <button className="btn-primary mt-4 w-full" onClick={analyzeAndAdd} disabled={busy}>{busy ? "Analyzing website…" : "Analyze & create brand"}</button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div><label className="label">Business name *</label><input className="inp" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Type</label><input className="inp" value={manual.type} onChange={(e) => setManual({ ...manual, type: e.target.value })} /></div>
              <div><label className="label">City / area</label><input className="inp" value={manual.city} onChange={(e) => setManual({ ...manual, city: e.target.value })} /></div>
            </div>
            <div><label className="label">Phone</label><input className="inp" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} /></div>
            <div><label className="label">Address</label><input className="inp" value={manual.address} onChange={(e) => setManual({ ...manual, address: e.target.value })} /></div>
            <button className="btn-primary mt-1 w-full" onClick={addManual}>Create brand</button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>
    </div>
  );
}

function Tile({ href, title, desc, tag, icon }: { href: string; title: string; desc: string; tag?: string; icon: string }) {
  return (
    <Link href={href} className="card group transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface2 text-coral"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg></span>
        {tag && <span className="rounded-md bg-coral/12 px-2 py-1 font-mono text-[10px] font-bold text-coralink">{tag}</span>}
      </div>
      <h3 className="font-display text-lg font-extrabold">{title}</h3>
      <p className="mt-1.5 text-sm text-ink2">{desc}</p>
    </Link>
  );
}

export default function Home() {
  const { active, ready, brands } = useBrandsCtx();

  if (!ready) return <div className="px-6 py-16 text-center text-muted">Loading…</div>;
  if (brands.length === 0 || !active) return <Onboarding />;

  const a = active.audit;
  const ringColor = !a ? "#8A8175" : a.score >= 75 ? "#1E7A54" : a.score >= 50 ? "#C98A18" : "#C6472C";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <span className="eyebrow">Dashboard</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">{active.businessName}</h1>
      <p className="mt-1 text-ink2">
        {active.businessType}{active.city ? ` · ${active.city}` : ""}{active.website ? ` · ` : ""}
        {active.website && <a href={active.website} target="_blank" rel="noreferrer" className="text-coralink hover:underline">{active.website.replace(/^https?:\/\//, "")}</a>}
      </p>
      {active.description && <p className="mt-2 max-w-2xl text-ink2">{active.description}</p>}

      {a && (
        <div className="card mt-6 flex flex-wrap items-center gap-5">
          <div className="grid h-24 w-24 flex-none place-items-center rounded-full" style={{ background: `conic-gradient(${ringColor} ${a.score}%, #FFF4EC 0)` }}>
            <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-paper"><b className="font-display text-2xl" style={{ color: ringColor }}>{a.score}</b></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-xs uppercase tracking-wide" style={{ color: ringColor }}>Website SEO score</div>
            <p className="mt-1 text-sm text-ink2">{a.summary}</p>
            <Link href="/seo" className="mt-2 inline-block text-sm font-bold text-coralink hover:underline">See full audit →</Link>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Tile href="/reviews" title="Review replies" tag="FLAGSHIP" desc="Connect Google to load this client's reviews, then approve AI replies." icon="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        <Tile href="/seo" title="SEO & ranking" desc="The full on-page audit for this brand's website, with fixes." icon="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" />
        <Tile href="/blog" title="Blog writer" tag="AI" desc="Generate SEO posts that read from this brand's website." icon="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" />
        <Tile href="/settings" title="Brand voice" desc="Tone, keywords, and details — used across every tool." icon="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </div>

      <p className="mt-6 text-sm text-muted">Managing more clients? Use <b className="text-ink">+ Add brand</b> at the top to switch between up to 5.</p>
    </div>
  );
}
