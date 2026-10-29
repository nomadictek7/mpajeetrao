"use client";

import { useEffect, useRef } from "react";
import { ui } from "@/lib/content";
import type { Embed, Video } from "@/lib/social";
import { usePrefs } from "./Prefs";
import { formatDate } from "./Sections";
import { useSite } from "./SiteContent";
import { SocialIcon, type Social } from "./SocialIcons";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
  }
}

// X's official widget script turns the timeline link and post blockquotes into embeds.
function useXWidgets(theme: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.twttr?.widgets) {
      window.twttr.widgets.load(el);
      return;
    }
    if (document.getElementById("x-widgets")) return; // still loading; it scans the page when ready
    const s = document.createElement("script");
    s.id = "x-widgets";
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    document.body.appendChild(s);
  }, [theme]);
  return ref;
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 font-display text-2xl font-bold">{children}</h3>;
}

function Fallback({ href, label }: { href: string; label: string }) {
  const { t } = usePrefs();
  return (
    <p className="mt-3 text-sm text-muted">
      {t(ui.feedFallback)}{" "}
      <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
        {label} →
      </a>
    </p>
  );
}

export function SocialFeeds({ videos, embeds }: { videos: Video[]; embeds: Embed[] }) {
  const { t, lang, dark } = usePrefs();
  const { profile, labels } = useSite();
  const theme = dark ? "dark" : "light";
  // Re-mounting on theme change makes X redraw the embeds in the matching colours.
  const xRef = useXWidgets(theme);
  const handle = (url: string) => (url ? (new URL(url).pathname.split("/").filter(Boolean)[0] ?? "") : "");
  const xHandle = handle(profile.x);
  const igHandle = handle(profile.instagram);

  const profiles = (
    [
      ["facebook", "Facebook", profile.facebook, "bg-[#1877f2]"],
      ["x", "X", profile.x, "bg-black"],
      ["instagram", "Instagram", profile.instagram, "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4]"],
      ["linkedin", "LinkedIn", profile.linkedin, "bg-[#0a66c2]"],
      ["youtube", "YouTube", profile.youtube, "bg-[#ff0000]"],
    ] as [Social, string, string, string][]
  ).filter(([, , href]) => href);

  return (
    <section id="social" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold md:text-4xl">{t(labels.social)}</h2>
        <div className="mt-3 h-1 w-16 rounded bg-saffron" />
        <p className="mt-4 max-w-2xl text-lg text-ink/80">{t(labels.socialSub)}</p>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {profiles.map(([icon, name, href, brand]) => (
          <li key={icon}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-saffron"
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${brand}`}>
                <SocialIcon name={icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold group-hover:text-accent">{name}</span>
                <span className="block whitespace-nowrap text-sm text-muted">{t(ui.openProfile)} →</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {videos.length > 0 && (
        <div className="mt-14">
          <Heading>{t(ui.latestVideos)}</Heading>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-saffron"
              >
                <span className="relative block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/10 transition group-hover:bg-black/25" aria-hidden>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ff0000] text-white">
                      <SocialIcon name="youtube" className="h-5 w-5" />
                    </span>
                  </span>
                </span>
                <span className="block p-4">
                  <span className="text-sm text-muted">{formatDate(v.published, lang)}</span>
                  <span className="mt-1 line-clamp-2 block font-semibold group-hover:text-accent">{v.title}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div key={theme} ref={xRef} className="mt-14 grid gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {igHandle && (
          <div className="min-w-0">
            <Heading>Instagram</Heading>
            {/* Instagram's official profile embed: header plus a grid of the latest posts. */}
            <iframe
              title="Instagram"
              src={`https://www.instagram.com/${igHandle}/embed/`}
              height={480}
              loading="lazy"
              className="w-full max-w-[480px] rounded-2xl border border-line bg-white"
            />
            <Fallback href={profile.instagram} label={`@${igHandle}`} />
          </div>
        )}
        {profile.facebook && (
          <div className="min-w-0">
            <Heading>Facebook</Heading>
            {/* Page card only: the plugin's timeline tab stays blank for visitors who block
                third-party cookies, which is most browsers now. */}
            <iframe
              title="Facebook"
              src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(profile.facebook)}&width=500&height=180&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false`}
              width={500}
              height={180}
              loading="lazy"
              allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
              className="w-full max-w-[500px] rounded-2xl border border-line bg-white"
            />
            <Fallback href={profile.facebook} label="Facebook" />
          </div>
        )}
        {xHandle && (
          <div className="min-w-0">
            <Heading>X</Heading>
            <div className="max-w-[550px] overflow-hidden rounded-2xl border border-line bg-surface">
              {/* X swaps this link for the timeline; visitors it won't show the timeline to (often when
                  signed out of X) keep this card. */}
              <a
                className="twitter-timeline group flex items-center gap-4 p-6"
                data-height="700"
                data-theme={theme}
                data-chrome="noheader nofooter noborders"
                data-dnt="true"
                href={`https://twitter.com/${xHandle}`}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-black text-white">
                  <SocialIcon name="x" className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-semibold group-hover:text-accent">@{xHandle}</span>
                  <span className="block text-sm text-muted">{t(ui.openProfile)} →</span>
                </span>
              </a>
            </div>
            <Fallback href={profile.x} label={`@${xHandle}`} />
          </div>
        )}

        {embeds.length > 0 && (
          <div className="lg:col-span-2 xl:col-span-3">
            <Heading>{t(ui.featuredPosts)}</Heading>
            <div className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {embeds.map((e, n) => (
                <div key={n} className="mb-6 break-inside-avoid">
                  {e.kind === "x" ? (
                    <blockquote className="twitter-tweet" data-theme={theme} data-dnt="true">
                      <a href={`https://twitter.com/i/status/${e.id}`}>View post on X</a>
                    </blockquote>
                  ) : (
                    <iframe
                      title={`${e.network} post`}
                      src={e.src}
                      height={e.height}
                      loading="lazy"
                      allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full rounded-2xl border border-line bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
