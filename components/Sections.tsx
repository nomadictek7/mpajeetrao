"use client";

import Link from "next/link";
import { useState } from "react";
import { gallery, galleryCategories, ui } from "@/lib/content";
import type { Photo, Post } from "@/lib/store";
import { Lightbox } from "./Lightbox";
import { usePrefs } from "./Prefs";
import { useSite } from "./SiteContent";

function Heading({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-8">
      <h2 className={`font-display text-3xl font-bold md:text-4xl ${light ? "text-white" : ""}`}>{children}</h2>
      <div className="mt-3 h-1 w-16 rounded bg-saffron" />
    </div>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-saffron/25 via-surface-2 to-green/20 text-center text-sm text-muted">
      <span className="px-4">{label}</span>
    </div>
  );
}

export function About() {
  const { t, lang } = usePrefs();
  const { about } = useSite();
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <Heading>{t(about.heading)}</Heading>
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-ink/85">
          {about.body.map((p, i) => (
            <p key={i}>{t(p)}</p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {about.stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface p-5">
              <div className="font-display text-3xl font-bold text-accent">
                {lang === "mr" && s.valueMr ? s.valueMr : s.value}
              </div>
              <div className="mt-1 text-sm text-muted">{t(s.label)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Impact() {
  const { t } = usePrefs();
  const { impact, labels } = useSite();
  const [sel, setI] = useState(0);
  if (!impact.length) return null;
  const i = Math.min(sel, impact.length - 1);
  return (
    <section id="impact" className="bg-surface-2 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Heading>{t(labels.impact)}</Heading>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="flex gap-2 overflow-x-auto md:flex-col">
            {impact.map((x, n) => (
              <button
                key={n}
                aria-pressed={n === i}
                aria-controls="impact-panel"
                onClick={() => setI(n)}
                className={`shrink-0 rounded-xl px-4 py-3 text-left font-semibold transition ${
                  n === i ? "bg-saffron text-on-brand" : "bg-surface hover:bg-surface/70"
                }`}
              >
                {t(x.title)}
              </button>
            ))}
          </div>
          <div key={i} id="impact-panel" aria-live="polite" className="fade-in overflow-hidden rounded-2xl bg-surface md:grid md:grid-cols-2">
            {impact[i].image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={impact[i].image} alt={t(impact[i].title)} className="aspect-[4/3] h-full w-full object-cover" />
            ) : (
              <PhotoPlaceholder label={t(impact[i].title)} />
            )}
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl font-bold">{t(impact[i].title)}</h3>
              <p className="mt-3 leading-relaxed text-ink/80">{t(impact[i].text)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  const { t } = usePrefs();
  const { journey, labels } = useSite();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="journey" className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <Heading>{t(labels.journey)}</Heading>
      <ol className="relative border-l-2 border-saffron/40 pl-8">
        {journey.map((j, n) => (
          <li key={n} className="relative mb-8 last:mb-0">
            <span className="absolute -left-[2.6rem] top-1 grid h-5 w-5 place-items-center rounded-full border-4 border-bg bg-saffron" />
            <div className="rounded-2xl border border-line bg-surface p-5">
              <span className="text-sm font-bold tracking-wide text-accent">{j.year}</span>
              <h3 className="font-display text-xl font-bold">{t(j.title)}</h3>
              {open === n && <p className="fade-in mt-2 text-ink/80">{t(j.text)}</p>}
              <button
                onClick={() => setOpen(open === n ? null : n)}
                className="mt-2 text-sm font-semibold text-accent hover:underline"
                aria-expanded={open === n}
              >
                {t(open === n ? ui.readLess : ui.readMore)}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Press() {
  const { t } = usePrefs();
  const { press, labels } = useSite();
  return (
    <section id="press" className="bg-dark py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Heading light>{t(labels.latestPress)}</Heading>
        <div className="grid gap-6 md:grid-cols-3">
          {press.map((p, n) => {
            const sample = !p.href || p.href === "#";
            return (
              <a
                key={n}
                href={p.href || "#"}
                target={sample ? undefined : "_blank"}
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={t(p.title)} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="h-2 bg-saffron" />
                )}
                <div className="p-6">
                  {p.date && <div className="text-sm text-white/60">{p.date}</div>}
                  <h3 className="mt-2 text-lg font-semibold group-hover:text-saffron-bright">{t(p.title)}</h3>
                  {sample && <p className="mt-3 text-xs text-white/50">{t(ui.placeholderNote)}</p>}
                </div>
              </a>
            );
          })}
        </div>
        <div className="mt-6 text-sm text-white/70">
          {t(ui.inParliament)}:{" "}
          <a
            href="https://sansad.in/rs/members"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-saffron-bright hover:underline"
          >
            sansad.in →
          </a>
        </div>
      </div>
    </section>
  );
}

// Uses photos uploaded through /admin; falls back to placeholder tiles until there are some.
export function Gallery({ photos }: { photos: Photo[] }) {
  const { t } = usePrefs();
  const { labels } = useSite();
  const [cat, setCat] = useState("all");
  const source: { cat: string; caption: { en: string; mr: string }; src?: string }[] = photos.length
    ? photos.map((p) => ({ cat: p.cat, caption: p.caption, src: p.url }))
    : gallery;
  const items = cat === "all" ? source : source.filter((g) => g.cat === cat);
  // The viewer steps through the photos in the current filter that have an image.
  const viewable = items.filter((g): g is typeof g & { src: string } => !!g.src);
  const [viewing, setViewing] = useState<number | null>(null);
  return (
    <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <Heading>{t(labels.gallery)}</Heading>
      <div className="mb-6 flex flex-wrap gap-2">
        {[{ id: "all", label: ui.all }, ...galleryCategories].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              cat === c.id ? "bg-saffron text-on-brand" : "border border-line bg-surface"
            }`}
          >
            {t(c.label)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((g, n) => (
          <figure key={`${cat}-${n}`} className="fade-in overflow-hidden rounded-2xl border border-line bg-surface">
            {g.src ? (
              <button
                type="button"
                onClick={() => setViewing(viewable.indexOf(g as (typeof viewable)[number]))}
                aria-label={`${t(ui.viewPhoto)}: ${t(g.caption) || g.caption.en}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={t(g.caption)}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
                  ⤢
                </span>
              </button>
            ) : (
              <PhotoPlaceholder label={t(ui.placeholderNote)} />
            )}
            {(t(g.caption) || g.caption.en) && (
              <figcaption className="p-3 text-sm font-medium">{t(g.caption) || g.caption.en}</figcaption>
            )}
          </figure>
        ))}
      </div>
      <Lightbox items={viewable} index={viewing} onIndex={setViewing} onClose={() => setViewing(null)} />
    </section>
  );
}

export function Events() {
  const { t } = usePrefs();
  const { events, labels } = useSite();
  if (!events.length) return null;
  return (
    <section id="events" className="bg-surface-2 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <Heading>{t(labels.events)}</Heading>
        <div className="grid gap-4 md:grid-cols-3">
          {events.map((e, n) => {
            const body = (
              <>
                {e.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image} alt={t(e.title)} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                )}
                <div className="flex gap-4 p-5">
                  <div className="grid h-14 min-w-14 shrink-0 place-items-center rounded-xl bg-saffron px-2 text-center text-sm font-bold leading-tight text-on-brand">
                    {e.date}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${e.href ? "group-hover:text-accent" : ""}`}>{t(e.title)}</h3>
                    <p className="text-sm text-muted">{t(e.place)}</p>
                    {e.href && <p className="mt-2 text-sm font-semibold text-accent">{t(ui.viewEvent)} →</p>}
                  </div>
                </div>
              </>
            );
            if (!e.href) return <div key={n} className="overflow-hidden rounded-2xl bg-surface">{body}</div>;
            // Site pages (/blog/…) open in place; outside articles open in a new tab.
            const external = /^https?:\/\//.test(e.href);
            const cls = "group overflow-hidden rounded-2xl bg-surface ring-saffron transition hover:shadow-md hover:ring-2";
            return external ? (
              <a key={n} href={e.href} target="_blank" rel="noreferrer" className={cls}>{body}</a>
            ) : (
              <Link key={n} href={e.href} className={cls}>{body}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t } = usePrefs();
  const { profile, labels } = useSite();
  const [form, setForm] = useState({ name: "", phone: "", district: "", message: "" });
  const field = "w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-saffron";

  // No backend yet: hand the message to the visitor's mail app.
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}\n${form.phone}\n${form.district}`;
    location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `Message from ${form.name}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <Heading>{t(labels.contact)}</Heading>
          <p className="text-lg text-ink/80">{t(labels.contactSub)}</p>
          <dl className="mt-8 space-y-3">
            <div><dt className="text-sm text-muted">{t(ui.emailLabel)}</dt><dd className="font-semibold"><a href={`mailto:${profile.email}`} className="hover:text-accent">{profile.email}</a></dd></div>
            <div><dt className="text-sm text-muted">{t(ui.phoneLabel)}</dt><dd className="font-semibold"><a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-accent">{profile.phone}</a></dd></div>
            <div><dt className="text-sm text-muted">{t(ui.delhiAddress)}</dt><dd className="font-semibold">{t(profile.address)}</dd></div>
            {t(profile.permanentAddress) && (
              <div><dt className="text-sm text-muted">{t(ui.permanentAddress)}</dt><dd className="font-semibold">{t(profile.permanentAddress)}</dd></div>
            )}
          </dl>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
          <input required aria-label={t(ui.name)} autoComplete="name" className={field} placeholder={t(ui.name)} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="tel" aria-label={t(ui.phone)} autoComplete="tel" className={field} placeholder={t(ui.phone)} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input aria-label={t(ui.district)} className={field} placeholder={t(ui.district)} value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <textarea required rows={5} aria-label={t(ui.message)} className={field} placeholder={t(ui.message)} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="w-full rounded-xl bg-saffron py-3 font-semibold text-on-brand hover:bg-saffron-deep">
            {t(ui.send)}
          </button>
        </form>
      </div>
    </section>
  );
}

export function LatestPosts({ posts }: { posts: Post[] }) {
  const { t } = usePrefs();
  const { labels } = useSite();
  if (!posts.length) return null;
  return (
    <section id="blog" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="flex items-end justify-between gap-4">
        <Heading>{t(labels.fromBlog)}</Heading>
        <Link href="/blog" className="mb-8 text-sm font-semibold text-accent hover:underline">
          {t(ui.allPosts)} →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.slice(0, 3).map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}

export function PostCard({ post }: { post: Post }) {
  const { t, lang } = usePrefs();
  const title = t(post.title) || post.title.en;
  const excerpt = t(post.excerpt) || post.excerpt.en;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-saffron"
    >
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt={title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-saffron/40 to-saffron-soft/40" />
      )}
      <div className="p-5">
        <div className="text-sm text-muted">{formatDate(post.date, lang)}</div>
        <h3 className="mt-1 text-lg font-bold group-hover:text-accent">{title}</h3>
        {excerpt && <p className="mt-2 line-clamp-3 text-sm text-ink/80">{excerpt}</p>}
      </div>
    </Link>
  );
}

export function formatDate(date: string, lang: string) {
  const d = new Date(`${date}T00:00:00`);
  return isNaN(+d) ? date : d.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { dateStyle: "long" });
}
