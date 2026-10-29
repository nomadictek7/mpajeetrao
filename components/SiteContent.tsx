"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/site";

const Ctx = createContext<SiteContent | null>(null);

export function SiteProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
