"use client";

import { useEffect, useState } from "react";
import { DEFAULT_BRAND, type BrandVoice } from "./types";

const KEY = "unbranded.brand";

export function loadBrand(): BrandVoice {
  if (typeof window === "undefined") return DEFAULT_BRAND;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_BRAND, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_BRAND;
}

export function saveBrand(b: BrandVoice) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(b));
  } catch {
    /* ignore */
  }
}

/** React hook: brand voice with persistence. `ready` guards against SSR flash. */
export function useBrand(): [BrandVoice, (b: BrandVoice) => void, boolean] {
  const [brand, setBrand] = useState<BrandVoice>(DEFAULT_BRAND);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setBrand(loadBrand());
    setReady(true);
  }, []);
  const update = (b: BrandVoice) => {
    setBrand(b);
    saveBrand(b);
  };
  return [brand, update, ready];
}
