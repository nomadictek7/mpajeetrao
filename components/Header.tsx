"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { nav, navHref } from "@/lib/content";
import { usePrefs } from "./Prefs";
import { useSite } from "./SiteContent";

type LinkProps = { className: string; onClick?: () => void };

function NavLinks({ pathname, className, onClick }: LinkProps & { pathname?: string }) {
  const { t } = usePrefs();
  // /blog/some-post still marks Blog as the current page.
  const current = (href: string) => pathname !== undefined && (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return nav.map((n) => (
    <Link
      key={n.id}
      href={navHref(n.id)}
      onClick={onClick}
      aria-current={current(navHref(n.id)) ? "page" : undefined}
      className={className}
    >
      {t(n.label)}
    </Link>
  ));
}

function ActiveNavLinks(props: LinkProps) {
  return <NavLinks {...props} pathname={usePathname()} />;
}

// The pathname is only known at request time, so prerendered pages show the links unhighlighted first.
function Nav(props: LinkProps) {
  return (
    <Suspense fallback={<NavLinks {...props} />}>
      <ActiveNavLinks {...props} />
    </Suspense>
  );
}

export default function Header() {
  const { t, lang, setLang, dark, toggleDark, large, toggleLarge } = usePrefs();
  const [open, setOpen] = useState(false);
  const { profile: site } = useSite();

  // Desktop tools sit on the orange bar; the mobile panel is light grey like the reference.
  const tools = (onLight: boolean) => {
    const ring = onLight ? "border-[#262626]/30 text-[#262626]" : "border-white/70 text-white";
    return (
      <div className="flex items-center gap-2">
        <div className={`flex overflow-hidden rounded-full border text-sm ${ring}`} role="group" aria-label="Language">
          {(["en", "mr"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-3 py-1 font-bold ${
                lang === l ? (onLight ? "bg-saffron text-on-brand" : "bg-white text-[#262626]") : "opacity-85 hover:opacity-100"
              }`}
            >
              {l === "en" ? "EN" : "मराठी"}
            </button>
          ))}
        </div>
        <button
          onClick={toggleLarge}
          aria-pressed={large}
          aria-label="Toggle large text"
          className={`grid h-8 w-8 place-items-center rounded-full border text-sm font-bold ${ring}`}
        >
          A+
        </button>
        <button
          onClick={toggleDark}
          aria-pressed={dark}
          aria-label="Toggle dark mode"
          className={`grid h-8 w-8 place-items-center rounded-full border ${ring}`}
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
    );
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors ${open ? "bg-[#f2f2f2]" : "bg-saffron"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.logo || "/images/bjp-logo.svg"} alt="BJP" className="h-8 w-8 object-contain" />
          </span>
          <span className={`leading-tight ${open ? "text-[#262626]" : "text-white"}`}>
            <span className="block font-display text-lg font-bold">{t(site.shortName)}</span>
            <span className="block text-xs opacity-90">{t(site.role)}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          <Nav className="border-b-2 border-transparent text-sm font-bold tracking-[2px] text-white hover:opacity-80 aria-[current=page]:border-white" />
        </nav>

        <div className="hidden lg:block">{tools(false)}</div>

        <button
          className={`grid h-10 w-10 place-items-center rounded-md border lg:hidden ${
            open ? "border-[#262626]/30 text-[#262626]" : "border-white/70 text-white"
          }`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-[#262626]/10 bg-[#f2f2f2] px-4 pb-4 text-[#262626] lg:hidden">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            <Nav
              onClick={() => setOpen(false)}
              className="py-2 font-bold tracking-[2px] hover:text-[#c2461c] aria-[current=page]:text-[#c2461c]"
            />
          </nav>
          {tools(true)}
        </div>
      )}
    </header>
  );
}
