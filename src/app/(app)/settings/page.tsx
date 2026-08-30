"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBrandsCtx } from "@/components/BrandsProvider";
import type { Brand } from "@/lib/brands";

export default function SettingsPage() {
  const { active, ready, updateBrand } = useBrandsCtx();
  const [form, setForm] = useState<Brand | null>(null);
  const [kwText, setKwText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(active ? { ...active } : null);
    setKwText(active ? active.keywords.join(", ") : "");
    setSaved(false);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <div className="px-6 py-16 text-center text-muted">Loading…</div>;
  if (!active || !form) return <div className="mx-auto max-w-xl px-6 py-16 text-center"><h1 className="font-display text-2xl font-extrabold">No brand selected</h1><p className="mt-2 text-ink2">Add a brand from the <Link href="/dashboard" className="font-semibold text-coralink hover:underline">home page</Link> first.</p></div>;

  function set<K extends keyof Brand>(key: K, value: Brand[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  }

  function save() {
    if (!form) return;
    const keywords = kwText.split(",").map((s) => s.trim()).filter(Boolean);
    updateBrand(form.id, { ...form, keywords });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <span className="eyebrow">Brand voice · {active.businessName}</span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Brand details &amp; voice</h1>
      <p className="mt-2 text-ink2">Used across every reply, blog, and suggestion for this brand.</p>

      <div className="card mt-6 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Business name</label><input className="inp" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} /></div>
          <div><label className="label">Business type</label><input className="inp" value={form.businessType} onChange={(e) => set("businessType", e.target.value)} /></div>
          <div><label className="label">City / area</label><input className="inp" value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
          <div><label className="label">Tone</label><select className="inp" value={form.tone} onChange={(e) => set("tone", e.target.value)}>{["Warm & friendly", "Professional", "Playful", "Luxury & refined", "Straight-talking"].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className="label">Website</label><input className="inp" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" /></div>
          <div><label className="label">Phone</label><input className="inp" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        </div>
        <div><label className="label">Address</label><input className="inp" value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
        <div>
          <label className="label">Ranking keywords (comma-separated)</label>
          <input className="inp" value={kwText} onChange={(e) => { setKwText(e.target.value); setSaved(false); }} placeholder="best coffee in Austin, oat milk latte" />
          <p className="mt-1 text-xs text-muted">Worked into replies and blogs naturally — never stuffed.</p>
        </div>
        <div><label className="label">Sign-off</label><input className="inp" value={form.signOff} onChange={(e) => set("signOff", e.target.value)} /></div>
        <div><label className="label">Notes (policies, things to always/never say)</label><textarea className="inp min-h-[80px]" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
        <div className="flex items-center gap-3">
          <button className="btn-primary" onClick={save}>Save changes</button>
          {saved && <span className="text-sm font-semibold text-good">Saved ✓</span>}
        </div>
      </div>

      <p className="mt-6 text-xs text-muted">Saved in your browser. In the full app this lives on your account and syncs across devices.</p>
    </div>
  );
}
