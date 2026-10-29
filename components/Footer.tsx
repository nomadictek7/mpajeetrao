"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, navHref, ui } from "@/lib/content";
import { usePrefs } from "./Prefs";
import { SocialIcon, type Social } from "./SocialIcons";
import { useSite } from "./SiteContent";

export default function Footer() {
  const { t } = usePrefs();
  const { profile: site, donate, labels } = useSite();
  const [sent, setSent] = useState(false);
  const socials = (
    [
      ["facebook", "Facebook", site.facebook],
      ["x", "X", site.x],
      ["instagram", "Instagram", site.instagram],
      ["youtube", "YouTube", site.youtube],
    ] as [Social, string, string][]
  ).filter(([, , href]) => href);

  return (
    <footer id="follow" className="bg-dark text-white">
      <div className="tricolor h-1" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold">{t(site.name)}</div>
          <p className="mt-2 text-sm text-white/70">{t(site.role)}</p>
          <p className="mt-6 text-sm font-semibold">{t(labels.newsletter)}</p>
          <form
            className="mt-2 flex overflow-hidden rounded-full bg-white/10"
            // No newsletter provider yet: send the request to the office inbox.
            onSubmit={(e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get("email");
              location.href = `mailto:${site.email}?subject=Subscribe&body=${encodeURIComponent(String(email))}`;
              setSent(true);
            }}
          >
            <input type="email" name="email" required aria-label={t(ui.emailPh)} placeholder={t(ui.emailPh)}
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/50" />
            <button className="bg-saffron px-4 text-sm font-semibold text-on-brand hover:bg-saffron-deep">{t(ui.subscribe)}</button>
          </form>
          {sent && <p className="mt-2 text-xs text-white/70" role="status">{t(ui.subscribed)}</p>}
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-saffron-bright">{t(labels.quickLinks)}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {nav.map((n) => (
              <li key={n.id}><Link href={navHref(n.id)} className="hover:text-white">{t(n.label)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-saffron-bright">{t(labels.donate)}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {donate.map((d) => (
              <li key={d.label}>
                <a href={d.href} target="_blank" rel="noreferrer" className="hover:text-white">{d.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-saffron-bright">{t(labels.follow)}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {socials.map(([icon, label, href]) => (
              <li key={icon}>
                <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 hover:text-white">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition group-hover:bg-saffron group-hover:text-on-brand">
                    <SocialIcon name={icon} className="h-4 w-4" />
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © 2026 {t(site.name)}. {t(ui.rights)}
      </div>
    </footer>
  );
}
