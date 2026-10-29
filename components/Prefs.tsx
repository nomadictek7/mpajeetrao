"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/content";

type Prefs = {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  toggleDark: () => void;
  large: boolean;
  toggleLarge: () => void;
  t: (v: Record<Lang, string>) => string;
};

const Ctx = createContext<Prefs | null>(null);

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const [large, setLarge] = useState(false);

  // Restore saved preferences after hydration so server and client markup match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (read("lang") === "mr") setLangState("mr");
    const theme = read("theme");
    setDark(theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
    setLarge(read("large") === "1");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.theme = dark ? "dark" : "light";
    root.style.fontSize = large ? "112.5%" : "";
  }, [lang, dark, large]);

  const value: Prefs = {
    lang,
    setLang: (l) => {
      setLangState(l);
      write("lang", l);
    },
    dark,
    toggleDark: () => {
      setDark((d) => {
        write("theme", d ? "light" : "dark");
        return !d;
      });
    },
    large,
    toggleLarge: () => {
      setLarge((v) => {
        write("large", v ? "0" : "1");
        return !v;
      });
    },
    t: (v) => v[lang],
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePrefs must be used inside PrefsProvider");
  return ctx;
}
