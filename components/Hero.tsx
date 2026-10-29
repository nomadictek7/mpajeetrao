"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "@/lib/content";
import { usePrefs } from "./Prefs";
import { useSite } from "./SiteContent";

export default function Hero() {
  const { t } = usePrefs();
  const { hero: heroSlides, profile: site, labels } = useSite();
  const [sel, setI] = useState(0);
  const i = heroSlides.length ? sel % heroSlides.length : 0;
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [copied, setCopied] = useState(false);

  const count = heroSlides.length;
  useEffect(() => {
    if (count < 2 || paused || hovering || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((x) => (x + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, paused, hovering]);

  async function share() {
    const data = { title: document.title, url: location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const slide = heroSlides[i] as (typeof heroSlides)[number] | undefined;

  return (
    <section id="home" className="relative overflow-hidden bg-dark text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(circle at 85% 20%, #ff7e54 0, transparent 45%)" }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
        <div
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
        >
          <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm">{t(site.party)}</p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">{t(site.name)}</h1>
          <p className="mt-3 text-lg text-white/80">{t(site.role)}</p>

          {slide && (
            <div key={i} className="fade-in mt-8 min-h-36 border-l-4 border-saffron pl-5">
              <p className="font-display text-2xl font-semibold text-saffron-bright">{t(slide.title)}</p>
              <p className="mt-2 max-w-xl text-white/85">{t(slide.text)}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2" role="group" aria-label="Highlights">
            {heroSlides.map((s, n) => (
              <button
                key={n}
                aria-pressed={n === i}
                aria-label={t(s.title)}
                onClick={() => setI(n)}
                className="grid h-6 place-items-center"
              >
                <span className={`block h-2 rounded-full transition-all ${n === i ? "w-8 bg-saffron-bright" : "w-2 bg-white/40"}`} />
              </button>
            ))}
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play highlights" : "Pause highlights"}
              className="ml-2 grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs hover:bg-white/20"
            >
              {paused ? "▶" : "❚❚"}
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-3 rounded-[2rem] bg-saffron/40 blur-2xl" />
          {/* Portrait is set from /admin/content → Profile */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.portrait || "/images/portrait.svg"}
            alt={t(site.name)}
            width={480}
            height={600}
            fetchPriority="high"
            className="relative aspect-[4/5] w-full rounded-[2rem] border-4 border-white/20 object-cover"
          />
        </div>
      </div>

      <div className="relative bg-saffron text-on-brand">
        <div className="mx-auto grid max-w-7xl grid-cols-3 text-center font-semibold">
          <Link href="/contact" className="py-3 hover:bg-saffron-deep">{t(labels.listen)}</Link>
          <Link href="/impact" className="py-3 hover:bg-saffron-deep">{t(labels.act)}</Link>
          <button onClick={share} className="py-3 font-semibold hover:bg-saffron-deep">
            {copied ? t(ui.copied) : t(labels.share)}
          </button>
        </div>
      </div>
    </section>
  );
}
