"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBrandsCtx } from "@/components/BrandsProvider";
import { emptyBrand, type AuditData } from "@/lib/brands";

function Logo() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-paper">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>
    </span>
  );
}

export default function Landing() {
  const router = useRouter();
  const { addBrand } = useBrandsCtx();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!url.trim()) { setError("Enter your website to start."); return; }
    setBusy(true); setError("");
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
      router.push("/dashboard");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3.5">
          <Logo />
          <span className="font-display text-lg font-extrabold tracking-tight">Unbranded</span>
          <nav className="ml-auto flex items-center gap-5 text-sm font-semibold text-ink2">
            <a href="#how" className="hidden hover:text-ink sm:block">How it works</a>
            <a href="#features" className="hidden hover:text-ink sm:block">Features</a>
            <Link href="/dashboard" className="btn-primary !py-2">Open app</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-coral/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 pb-8 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-bold text-coralink">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Google + AI search, handled
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Get your business found on Google <span className="text-coral">and AI</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink2">
            Unbranded audits your website, tells you exactly what to fix, then writes your blogs and replies to your reviews — so ChatGPT, Claude, Gemini <em>and</em> Google all recommend you.
          </p>

          {/* Website box */}
          <div className="mx-auto mt-8 flex max-w-lg flex-col gap-2 sm:flex-row">
            <input className="inp flex-1 !py-3 text-center sm:text-left" placeholder="Enter your website — e.g. yourbusiness.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} />
            <button className="btn-primary !py-3" onClick={analyze} disabled={busy}>{busy ? "Analyzing…" : "Analyze free →"}</button>
          </div>
          {error && <p className="mt-2 text-sm text-bad">{error}</p>}
          <p className="mt-2 text-xs text-muted">No credit card. No website? <Link href="/dashboard" className="font-semibold text-coralink hover:underline">Add your business by hand →</Link></p>

          {/* Platform row */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Optimized to be recommended by</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-display text-lg font-extrabold text-ink2">
              <span>ChatGPT</span><span className="text-line">·</span>
              <span>Claude</span><span className="text-line">·</span>
              <span>Gemini</span><span className="text-line">·</span>
              <span>Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-line bg-surface2/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight">Three steps to being everywhere.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { n: "01", t: "Add your website", d: "Paste your site (or add your business by hand). We read it in seconds." },
              { n: "02", t: "See what to fix", d: "A clear score for Google SEO and AI visibility, with the exact improvements." },
              { n: "03", t: "Let AI do the work", d: "Auto-written blogs for your site and AI replies to every Google review." },
            ].map((s) => (
              <div key={s.n} className="card">
                <span className="font-mono text-sm font-bold text-coralink">{s.n}</span>
                <h3 className="mt-2 font-display text-xl font-extrabold">{s.t}</h3>
                <p className="mt-2 text-sm text-ink2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight">Everything your business needs to get found.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              { t: "Website & SEO audit", d: "A plain-English score of what Google sees, with the fixes that move you up the rankings.", i: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" },
              { t: "AI visibility (ChatGPT, Claude, Gemini)", d: "See exactly what to change so AI assistants understand and recommend your business.", i: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" },
              { t: "Auto-written blogs", d: "AI reads your website and writes SEO posts you can publish — no writing required.", i: "M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" },
              { t: "Google review replies", d: "Connect your Google Business Profile and approve warm, on-brand replies to every review.", i: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" },
            ].map((f) => (
              <div key={f.t} className="card flex gap-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-surface2 text-coral"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={f.i} /></svg></span>
                <div><h3 className="font-display text-lg font-extrabold">{f.t}</h3><p className="mt-1 text-sm text-ink2">{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="rounded-3xl bg-ink px-8 py-14 text-paper">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl">Ready to get recommended everywhere?</h2>
            <p className="mx-auto mt-3 max-w-md text-paper/70">Add your first business and see your Google + AI score in under a minute.</p>
            <Link href="/dashboard" className="btn-primary mt-6 inline-flex !px-6 !py-3 text-base">Get started free →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-8 text-sm text-muted">
          <Logo /><span className="font-display font-extrabold text-ink">Unbranded</span>
          <span className="ml-auto">Rank on Google &amp; AI.</span>
        </div>
      </footer>
    </div>
  );
}
