"use client";

import { useState } from "react";

interface Check {
  state: "good" | "warn" | "bad";
  title: string;
  detail: string;
}
interface AuditResult {
  url: string;
  title: string | null;
  score: number;
  checks: Check[];
  summary: string;
}

const badge: Record<Check["state"], string> = {
  good: "bg-good/15 text-good",
  warn: "bg-warn/18 text-warn",
  bad: "bg-bad/15 text-bad",
};
const badgeLabel: Record<Check["state"], string> = { good: "Good", warn: "Fix", bad: "Urgent" };

export default function SeoPage() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);

  async function run() {
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword }),
      });
      const data = await res.json();
      if (data.checks) setResult(data);
      else setError(data.error || "Audit failed.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  const ringColor = !result ? "" : result.score >= 75 ? "#1E7A54" : result.score >= 50 ? "#C98A18" : "#C6472C";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <span className="eyebrow">SEO &amp; Ranking</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Website ranking audit</h1>
      <p className="mt-2 text-ink2">Scan any live site for the on-page signals Google uses to rank local businesses.</p>

      <div className="card mt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Website URL</label>
            <input className="inp" placeholder="yourbusiness.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} />
          </div>
          <div>
            <label className="label">Target keyword (optional)</label>
            <input className="inp" placeholder="best coffee in Austin" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} />
          </div>
        </div>
        <div className="mt-4">
          <button className="btn-primary" onClick={run} disabled={busy}>{busy ? "Scanning…" : "Run audit"}</button>
        </div>
        {error && <p className="mt-3 text-sm text-bad">{error}</p>}
      </div>

      {result && (
        <div className="card mt-6">
          <div className="flex flex-wrap items-center gap-5">
            <div
              className="grid h-24 w-24 flex-none place-items-center rounded-full"
              style={{ background: `conic-gradient(${ringColor} ${result.score}%, #FFF4EC 0)` }}
            >
              <div className="grid h-[76px] w-[76px] place-items-center rounded-full bg-paper">
                <b className="font-display text-2xl" style={{ color: ringColor }}>{result.score}</b>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-xs uppercase tracking-wide" style={{ color: ringColor }}>
                {result.score >= 75 ? "Strong" : result.score >= 50 ? "Needs work" : "At risk"}
              </div>
              <h2 className="mt-1 truncate font-display text-xl font-extrabold">{result.url.replace(/^https?:\/\//, "")}</h2>
              <p className="mt-1 text-sm text-ink2">{result.summary}</p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-line">
            {result.checks.map((c, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <span className={`mt-0.5 flex-none rounded px-2 py-0.5 text-[11px] font-bold uppercase ${badge[c.state]}`}>{badgeLabel[c.state]}</span>
                <div>
                  <b className="text-sm">{c.title}</b>
                  <p className="text-sm text-muted">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
