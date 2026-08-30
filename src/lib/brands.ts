"use client";

import { useCallback, useEffect, useState } from "react";
import type { BrandVoice } from "./types";

export const MAX_BRANDS = 5;

type CheckLite = { state: "good" | "warn" | "bad"; title: string; detail: string };

export interface AuditData {
  score: number;
  title: string | null;
  summary: string;
  checks: CheckLite[];
  /** AI visibility (ChatGPT/Claude/Gemini) recommendations. */
  aeo?: CheckLite[];
}

/** A saved brand / project. Extends the voice fields with identity + data. */
export interface Brand extends BrandVoice {
  id: string;
  website: string;
  phone: string;
  address: string;
  description: string;
  audit?: AuditData;
  createdAt: number;
}

const BKEY = "unbranded.brands";
const AKEY = "unbranded.activeBrand";

export function newBrandId(): string {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function emptyBrand(partial: Partial<Brand> = {}): Brand {
  return {
    id: newBrandId(),
    businessName: "",
    businessType: "Local business",
    city: "",
    tone: "Warm & friendly",
    keywords: [],
    signOff: "",
    notes: "",
    website: "",
    phone: "",
    address: "",
    description: "",
    createdAt: Date.now(),
    ...partial,
  };
}

function read(): Brand[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BKEY);
    return raw ? (JSON.parse(raw) as Brand[]) : [];
  } catch {
    return [];
  }
}

function write(brands: Brand[]) {
  try {
    window.localStorage.setItem(BKEY, JSON.stringify(brands));
  } catch {
    /* ignore */
  }
}

/** Central store hook for brands + the active selection. */
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const b = read();
    setBrands(b);
    let a = "";
    try {
      a = window.localStorage.getItem(AKEY) || "";
    } catch {
      /* ignore */
    }
    if (!a || !b.some((x) => x.id === a)) a = b[0]?.id || "";
    setActiveId(a);
    setReady(true);
  }, []);

  const persist = useCallback((next: Brand[]) => {
    setBrands(next);
    write(next);
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveId(id);
    try {
      window.localStorage.setItem(AKEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const addBrand = useCallback(
    (brand: Brand): boolean => {
      let ok = false;
      setBrands((prev) => {
        if (prev.length >= MAX_BRANDS) return prev;
        const next = [...prev, brand];
        write(next);
        ok = true;
        return next;
      });
      setActive(brand.id);
      return ok;
    },
    [setActive],
  );

  const updateBrand = useCallback(
    (id: string, patch: Partial<Brand>) => {
      setBrands((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
        write(next);
        return next;
      });
    },
    [],
  );

  const removeBrand = useCallback(
    (id: string) => {
      setBrands((prev) => {
        const next = prev.filter((b) => b.id !== id);
        write(next);
        if (activeId === id) setActive(next[0]?.id || "");
        return next;
      });
    },
    [activeId, setActive],
  );

  const active = brands.find((b) => b.id === activeId) || null;

  return { brands, active, activeId, ready, setActive, addBrand, updateBrand, removeBrand };
}
