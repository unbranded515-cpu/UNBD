"use client";

import { useState } from "react";
import { useBrandsCtx } from "./BrandsProvider";
import { AddBrandModal } from "./AddBrandModal";
import { MAX_BRANDS } from "@/lib/brands";

export function BrandBar() {
  const { brands, active, activeId, ready, setActive, removeBrand } = useBrandsCtx();
  const [openMenu, setOpenMenu] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  if (!ready || brands.length === 0) return null; // onboarding handles the empty state

  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-surface/90 px-6 py-2.5 backdrop-blur">
      <span className="hidden text-xs font-semibold uppercase tracking-wide text-muted sm:block">Brand</span>
      <div className="relative">
        <button className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5 text-sm font-bold hover:bg-surface2" onClick={() => setOpenMenu((o) => !o)}>
          <span className="grid h-5 w-5 place-items-center rounded bg-coral text-[10px] font-extrabold text-white">{(active?.businessName || "?").charAt(0).toUpperCase()}</span>
          {active?.businessName || "Select brand"}
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {openMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(false)} />
            <div className="absolute left-0 z-20 mt-1 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-xl">
              {brands.map((b) => (
                <div key={b.id} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm ${b.id === activeId ? "bg-surface2" : "hover:bg-surface2"}`}>
                  <button className="flex flex-1 items-center gap-2 text-left" onClick={() => { setActive(b.id); setOpenMenu(false); }}>
                    <span className="grid h-6 w-6 flex-none place-items-center rounded bg-coral text-[11px] font-extrabold text-white">{b.businessName.charAt(0).toUpperCase()}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{b.businessName}</span>
                      {b.website && <span className="block truncate text-xs text-muted">{b.website.replace(/^https?:\/\//, "")}</span>}
                    </span>
                    {b.id === activeId && <span className="ml-auto text-xs font-bold text-good">✓</span>}
                  </button>
                  <button className="flex-none rounded p-1 text-muted hover:text-bad" title="Remove brand" onClick={() => { if (confirm(`Remove ${b.businessName}?`)) removeBrand(b.id); }}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <button className="ml-auto rounded-lg border border-line bg-paper px-3 py-1.5 text-sm font-bold text-coralink hover:bg-surface2 disabled:opacity-50" onClick={() => setOpenAdd(true)} disabled={brands.length >= MAX_BRANDS}>
        + Add brand <span className="text-muted">({brands.length}/{MAX_BRANDS})</span>
      </button>
      <AddBrandModal open={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}
