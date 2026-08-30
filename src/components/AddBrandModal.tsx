"use client";

import { useState } from "react";
import { emptyBrand, MAX_BRANDS, type AuditData } from "@/lib/brands";
import { useBrandsCtx } from "./BrandsProvider";

export function AddBrandModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { brands, addBrand } = useBrandsCtx();
  const [mode, setMode] = useState<"website" | "manual">("website");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState({ name: "", type: "Local business", city: "", phone: "", address: "" });

  const full = brands.length >= MAX_BRANDS;

  if (!open) return null;

  async function analyzeAndAdd() {
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      const audit: AuditData = data.audit;
      const p = data.profile;
      const brand = emptyBrand({
        businessName: p.businessName,
        businessType: p.businessType || "Local business",
        city: p.city,
        keywords: p.keywords || [],
        description: p.description || "",
        tone: p.tone || "Warm & friendly",
        signOff: p.businessName ? `— The team at ${p.businessName}` : "",
        website: data.url,
        audit,
      });
      if (!addBrand(brand)) setError(`You can add up to ${MAX_BRANDS} brands.`);
      else {
        reset();
        onClose();
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  function addManual() {
    if (!manual.name.trim()) {
      setError("Enter the business name.");
      return;
    }
    const brand = emptyBrand({
      businessName: manual.name.trim(),
      businessType: manual.type,
      city: manual.city.trim(),
      phone: manual.phone.trim(),
      address: manual.address.trim(),
      signOff: `— The team at ${manual.name.trim()}`,
    });
    if (!addBrand(brand)) setError(`You can add up to ${MAX_BRANDS} brands.`);
    else {
      reset();
      onClose();
    }
  }

  function reset() {
    setUrl("");
    setManual({ name: "", type: "Local business", city: "", phone: "", address: "" });
    setError("");
    setMode("website");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-extrabold">Add a brand</h3>
          <button className="text-2xl leading-none text-muted" onClick={onClose} aria-label="Close">×</button>
        </div>

        {full ? (
          <p className="mt-4 rounded-lg bg-surface2 px-4 py-3 text-sm text-ink2">You've reached the limit of {MAX_BRANDS} brands. Remove one from the switcher to add another.</p>
        ) : (
          <>
            <div className="mt-4 inline-flex rounded-lg border border-line p-1 text-sm">
              <button className={`rounded-md px-3 py-1.5 font-semibold ${mode === "website" ? "bg-coral text-white" : "text-ink2"}`} onClick={() => setMode("website")}>From website</button>
              <button className={`rounded-md px-3 py-1.5 font-semibold ${mode === "manual" ? "bg-coral text-white" : "text-ink2"}`} onClick={() => setMode("manual")}>Add manually</button>
            </div>

            {mode === "website" ? (
              <div className="mt-4">
                <label className="label">Business website</label>
                <input className="inp" placeholder="yourclient.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyzeAndAdd()} autoFocus />
                <p className="mt-1.5 text-xs text-muted">We&apos;ll pull the site and fill in the name, keywords, and what to improve.</p>
                <button className="btn-primary mt-4 w-full" onClick={analyzeAndAdd} disabled={busy}>{busy ? "Analyzing website…" : "Analyze & add brand"}</button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="label">Business name *</label>
                  <input className="inp" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Type</label>
                    <input className="inp" value={manual.type} onChange={(e) => setManual({ ...manual, type: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">City / area</label>
                    <input className="inp" value={manual.city} onChange={(e) => setManual({ ...manual, city: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="inp" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="inp" value={manual.address} onChange={(e) => setManual({ ...manual, address: e.target.value })} />
                </div>
                <button className="btn-primary mt-1 w-full" onClick={addManual}>Add brand</button>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-bad">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
