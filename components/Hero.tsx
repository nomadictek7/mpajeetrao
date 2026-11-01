"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ui } from "@/lib/content";
import { usePrefs } from "./Prefs";
import { useSite } from "./SiteContent";

export default function Hero() {
  const { t } = usePrefs();
  const { hero: heroSlides, heroPhotos, profile: site, labels } = useSite();
  const photos = [site.portrait || "/images/portrait.svg", ...heroPhotos.map((p) => p.src).filter(Boolean)];
  const [photo, setPhoto] = useState(0);
  // Wide photos are shown whole over a blurred copy instead of being cropped to the tall frame.
  const [wide, setWide] = useState<Record<string, boolean>>({});
  const checkWide = (src: string, img: HTMLImageElement) => {
    if (img.naturalWidth > img.naturalHeight && !wide[src]) setWide((w) => ({ ...w, [src]: true }));
  };
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

  useEffect(() => {
    if (photos.length < 2 || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPhoto((x) => (x + 1) % photos.length), 5000);
    return () => clearInterval(id);
  }, [photos.length, paused]);

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
          {/* Portrait (Profile) first, then the Hero photos — both set from /admin/content */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-4 border-white/20 bg-dark">
            {photos.map((src, n) => (
              <div
                key={src + n}
                aria-hidden={n !== photo || undefined}
                className={`absolute inset-0 transition-opacity duration-1000 ${n === photo ? "opacity-100" : "opacity-0"}`}
              >
                {wide[src] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={n === 0 ? t(site.name) : ""}
                  width={480}
                  height={600}
                  fetchPriority={n === 0 ? "high" : undefined}
                  loading={n === 0 ? undefined : "lazy"}
                  ref={(img) => {
                    if (img?.complete) checkWide(src, img);
                  }}
                  onLoad={(e) => checkWide(src, e.currentTarget)}
                  className={`relative h-full w-full ${wide[src] ? "object-contain" : "object-cover"} ${n === 0 ? "" : "object-top"}`}
                />
              </div>
            ))}
          </div>
          {photos.length > 1 && (
            <div className="relative mt-3 flex justify-center gap-2" role="group" aria-label="Photos">
              {photos.map((_, n) => (
                <button key={n} aria-pressed={n === photo} aria-label={`Photo ${n + 1}`} onClick={() => setPhoto(n)} className="grid h-6 place-items-center">
                  <span className={`block h-2 rounded-full transition-all ${n === photo ? "w-6 bg-saffron-bright" : "w-2 bg-white/40"}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative bg-saffron text-on-brand">
        <div className="mx-auto grid max-w-7xl grid-cols-3 text-center font-semibold">
          <Link href="/contact" className="py-3 hover:bg-saffron-deep">{t(labels.listen)}</Link>
          <Link href="/about#impact" className="py-3 hover:bg-saffron-deep">{t(labels.act)}</Link>
          <button onClick={share} className="py-3 font-semibold hover:bg-saffron-deep">
            {copied ? t(ui.copied) : t(labels.share)}
          </button>
        </div>
      </div>
    </section>
  );
}
