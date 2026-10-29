"use client";

import { useEffect, useRef } from "react";
import { ui } from "@/lib/content";
import { usePrefs } from "./Prefs";

export type LightboxItem = { src: string; caption: { en: string; mr: string } };

// Full-screen photo viewer. A native <dialog> gives focus trapping and Esc to close;
// arrow keys and swipes move between photos, wrapping around at either end.
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t } = usePrefs();
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null && items.length > 0;
  const count = items.length;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) return;
    // Keep the page behind from scrolling while the viewer is up.
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  // Load the neighbours so Next/Previous feel instant.
  useEffect(() => {
    if (index === null || count < 2) return;
    for (const d of [1, -1]) new Image().src = items[(index + d + count) % count].src;
  }, [index, items, count]);

  if (index === null || !count) return <dialog ref={ref} className="hidden" />;
  const i = Math.min(index, count - 1);
  const item = items[i];
  const go = (d: number) => onIndex((i + d + count) % count);
  const caption = t(item.caption) || item.caption.en;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={caption || t(ui.gallery)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      // Clicking the dark area around the photo closes the viewer.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-neutral-950 p-0 text-white backdrop:bg-black"
    >
      <div className="pointer-events-none flex h-full flex-col">
        <div className="pointer-events-auto flex items-center justify-between px-4 py-3 text-sm">
          <span className="tabular-nums text-white/70" aria-live="polite">
            {i + 1} / {count}
          </span>
          <button
            onClick={onClose}
            aria-label={t(ui.closePhoto)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={item.src}
            src={item.src}
            alt={caption}
            className="fade-in pointer-events-auto max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
          {count > 1 && (
            <>
              <NavButton side="left" label={t(ui.prevPhoto)} onClick={() => go(-1)}>‹</NavButton>
              <NavButton side="right" label={t(ui.nextPhoto)} onClick={() => go(1)}>›</NavButton>
            </>
          )}
        </div>

        <div className="pointer-events-auto mx-auto w-full max-w-3xl px-4 py-4 text-center">
          {caption && <p className="text-sm text-white/90 md:text-base">{caption}</p>}
          {count > 1 && (
            <button
              onClick={() => go(1)}
              className="mt-3 rounded-full bg-saffron px-6 py-2 text-sm font-semibold text-on-brand hover:bg-saffron-deep"
            >
              {t(ui.nextPhoto)} →
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}

function NavButton({
  side,
  label,
  onClick,
  children,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`pointer-events-auto absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-3xl leading-none ring-1 ring-white/20 hover:bg-saffron hover:text-on-brand ${
        side === "left" ? "left-2 md:left-5" : "right-2 md:right-5"
      }`}
    >
      {children}
    </button>
  );
}
