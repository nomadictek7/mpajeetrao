"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "@/lib/editor-schema";

const groups = [
  { title: "", links: [{ href: "/admin", label: "Overview" }] },
  {
    title: "Website",
    links: sections.map((s) => ({ href: `/admin/content/${s.key}`, label: s.title })),
  },
  {
    title: "Media & records",
    links: [
      { href: "/admin/photos", label: "Photo gallery" },
      { href: "/admin/blog", label: "Blog posts" },
      { href: "/admin/parliament", label: "Parliament record" },
    ],
  },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
      {groups.map((g) => (
        <div key={g.title} className="contents lg:mb-5 lg:block">
          {g.title && (
            <div className="hidden px-3 pb-1 text-[11px] font-bold uppercase tracking-[2px] text-muted lg:block">
              {g.title}
            </div>
          )}
          {g.links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`block shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-saffron text-on-brand" : "text-ink/80 hover:bg-surface-2"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
