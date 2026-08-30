"use client";

import { createContext, useContext } from "react";
import { useBrands } from "@/lib/brands";

type BrandsCtx = ReturnType<typeof useBrands>;

const Ctx = createContext<BrandsCtx | null>(null);

export function BrandsProvider({ children }: { children: React.ReactNode }) {
  const value = useBrands();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrandsCtx(): BrandsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBrandsCtx must be used within BrandsProvider");
  return c;
}
