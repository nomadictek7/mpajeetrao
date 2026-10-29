// Editable website content. Defaults come from lib/content.ts; a section saved
// from /admin/content is stored in the Redis hash "site" and overrides the
// default. Restoring a section deletes its field.

import { hasDb, redis } from "./store";
import { cacheLife, cacheTag } from "next/cache";
import * as defaults from "./content";
import type { Lang } from "./content";

export type T = Record<Lang, string>;

export type SiteContent = {
  profile: {
    name: T;
    shortName: T;
    role: T;
    party: T;
    portrait: string;
    logo: string;
    email: string;
    phone: string;
    address: T;
    permanentAddress: T;
    facebook: string;
    x: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  hero: { title: T; text: T }[];
  about: { heading: T; body: T[]; stats: { value: string; valueMr: string; label: T }[] };
  impact: { title: T; text: T; image: string }[];
  journey: { year: string; title: T; text: T }[];
  press: { title: T; date: string; href: string; image: string }[];
  events: { date: string; title: T; place: T; image: string; href: string }[];
  social: { url: string }[];
  donate: { label: string; href: string }[];
  labels: Record<LabelKey, T>;
};

export type SectionKey = keyof SiteContent;

// Section headings and short texts from lib/content.ts `ui` that the office can
// reword. The rest of `ui` (buttons, filters, form placeholders) stays fixed.
export const labelKeys = [
  "listen", "act", "share",
  "impact", "parliament", "parliamentSub", "journey", "latestPress", "gallery", "fromBlog", "events",
  "social", "socialSub",
  "contact", "contactSub",
  "newsletter", "quickLinks", "donate", "follow",
  "questionsTitle", "questionsIntro",
] as const satisfies readonly (keyof typeof defaults.ui)[];
export type LabelKey = (typeof labelKeys)[number];

const d = defaults;
export const defaultContent: SiteContent = {
  profile: {
    name: d.site.name,
    shortName: d.site.shortName,
    role: d.site.role,
    party: d.site.party,
    portrait: "/images/portrait.svg",
    logo: "/images/bjp-logo.svg", // official BJP symbol (Wikimedia Commons, public domain, trademarked)
    email: d.site.contact.email,
    phone: d.site.contact.phone,
    address: d.site.contact.address,
    permanentAddress: d.site.contact.permanentAddress,
    ...d.site.social,
  },
  hero: d.heroSlides,
  about: {
    heading: d.about.heading,
    body: d.about.body,
    stats: d.about.stats.map((s) => ({ value: s.value, valueMr: s.valueMr ?? "", label: s.label })),
  },
  impact: d.impact.map((x) => ({ ...x, image: x.image ?? "" })),
  journey: d.journey,
  press: d.press.map((x) => ({ ...x, image: x.image ?? "" })),
  events: d.events.map((x) => ({ ...x, image: x.image ?? "", href: x.href ?? "" })),
  social: d.socialPosts,
  donate: d.donate,
  labels: Object.fromEntries(labelKeys.map((k) => [k, d.ui[k]])) as Record<LabelKey, T>,
};

// ---- Validation -----------------------------------------------------------
// Saved data is rebuilt field by field from these shapes, so unknown keys are
// dropped and every value is a bounded string.

const t: T = { en: "", mr: "" };
const shapes: { [K in SectionKey]: unknown } = {
  profile: {
    name: t, shortName: t, role: t, party: t, portrait: "img", logo: "img", email: "", phone: "", address: t, permanentAddress: t,
    facebook: "url", x: "url", instagram: "url", youtube: "url", linkedin: "url",
  },
  hero: [{ title: t, text: t }],
  about: { heading: t, body: [t], stats: [{ value: "", valueMr: "", label: t }] },
  impact: [{ title: t, text: t, image: "img" }],
  journey: [{ year: "", title: t, text: t }],
  press: [{ title: t, date: "", href: "url", image: "img" }],
  events: [{ date: "", title: t, place: t, image: "img", href: "url" }],
  social: [{ url: "url" }],
  donate: [{ label: "", href: "url" }],
  labels: Object.fromEntries(labelKeys.map((k) => [k, t])),
};

export function safeUrl(v: string) {
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(v) ? v : "";
}

export function safeImage(v: string) {
  if (v.startsWith("/images/")) return v;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com") ? v : "";
  } catch {
    return "";
  }
}

function clean(value: unknown, shape: unknown): unknown {
  if (Array.isArray(shape)) {
    return (Array.isArray(value) ? value : []).slice(0, 50).map((v) => clean(v, shape[0]));
  }
  if (shape && typeof shape === "object") {
    const src = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(shape).map(([k, s]) => [k, clean(src[k], s)]));
  }
  const str = typeof value === "string" ? value.trim().slice(0, 5000) : "";
  if (shape === "url") return safeUrl(str);
  if (shape === "img") return safeImage(str);
  return str;
}

export function cleanSection<K extends SectionKey>(key: K, value: unknown): SiteContent[K] {
  return clean(value, shapes[key]) as SiteContent[K];
}

// ---- Storage ----------------------------------------------------------------

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("site");
  const saved: Partial<Record<SectionKey, unknown>> = hasDb() ? ((await redis().hgetall("site")) ?? {}) : {};
  const out = { ...defaultContent };
  for (const key of Object.keys(defaultContent) as SectionKey[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (saved[key] != null) (out as any)[key] = cleanSection(key, saved[key]);
  }
  // A label left blank (or added after the section was saved) uses the default.
  out.labels = Object.fromEntries(
    labelKeys.map((k) => {
      const v = out.labels[k];
      return [k, { en: v.en || defaultContent.labels[k].en, mr: v.mr || defaultContent.labels[k].mr }];
    }),
  ) as Record<LabelKey, T>;
  return out;
}

// null restores the section to its default.
export async function writeSection<K extends SectionKey>(key: K, value: SiteContent[K] | null) {
  if (value === null) await redis().hdel("site", key);
  else await redis().hset("site", { [key]: value });
}
