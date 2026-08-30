"use client";

import { useState } from "react";
import { useBrand } from "@/lib/useBrand";
import { DEFAULT_BRAND } from "@/lib/types";

export default function SettingsPage() {
  const [brand, update, ready] = useBrand();
  const [saved, setSaved] = useState(false);
  const [kwText, setKwText] = useState<string | null>(null);

  if (!ready) return <div className="px-6 py-10 text-muted">Loading…</div>;

  const keywords = kwText === null ? brand.keywords.join(", ") : kwText;

  function set<K extends keyof typeof brand>(key: K, value: (typeof brand)[K]) {
    update({ ...brand, [key]: value });
    setSaved(false);
  }

  function save() {
    const kws = keywords.split(",").map((s) => s.trim()).filter(Boolean);
    update({ ...brand, keywords: kws });
    setKwText(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <span className="eyebrow">Brand voice</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">How your replies sound</h1>
      <p className="mt-2 text-ink2">Set this once. Every review reply and suggestion is written in this voice, with these keywords worked in naturally.</p>

      <div className="card mt-6 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Business name</label>
            <input className="inp" value={brand.businessName} onChange={(e) => set("businessName", e.target.value)} />
          </div>
          <div>
            <label className="label">Business type</label>
            <input className="inp" value={brand.businessType} onChange={(e) => set("businessType", e.target.value)} />
          </div>
          <div>
            <label className="label">City / area</label>
            <input className="inp" value={brand.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label className="label">Tone</label>
            <select className="inp" value={brand.tone} onChange={(e) => set("tone", e.target.value)}>
              {["Warm & friendly", "Professional", "Playful", "Luxury & refined", "Straight-talking"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Ranking keywords (comma-separated)</label>
          <input className="inp" value={keywords} onChange={(e) => setKwText(e.target.value)} placeholder="best coffee in Austin, oat milk latte" />
          <p className="mt-1 text-xs text-muted">Worked into replies naturally — never stuffed.</p>
        </div>

        <div>
          <label className="label">Sign-off</label>
          <input className="inp" value={brand.signOff} onChange={(e) => set("signOff", e.target.value)} />
        </div>

        <div>
          <label className="label">Notes (policies, things to always/never say)</label>
          <textarea className="inp min-h-[80px]" value={brand.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={save}>Save brand voice</button>
          <button className="btn-ghost" onClick={() => { update(DEFAULT_BRAND); setKwText(null); }}>Reset to example</button>
          {saved && <span className="text-sm font-semibold text-good">Saved ✓</span>}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">Stored in your browser for now. In the full app this lives on your account and syncs across devices.</p>
    </div>
  );
}
