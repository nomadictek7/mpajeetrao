import Link from "next/link";
import { sections } from "@/lib/editor-schema";
import { getParliament } from "@/lib/parliament";
import { getSiteContent } from "@/lib/site";
import { getPhotos, getPosts } from "@/lib/store";
import { btn, btnGhost } from "../ui";

export default async function Dashboard() {
  const [photos, posts, content, parliament] = await Promise.all([getPhotos(), getPosts(), getSiteContent(), getParliament()]);

  const count = (key: (typeof sections)[number]["key"]) => {
    const v = content[key];
    if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? "" : "s"}`;
    if (key === "labels") return `${Object.keys(content.labels).length} labels`;
    if (key === "about") return `${content.about.body.length} paragraphs · ${content.about.stats.length} facts`;
    return "";
  };

  // Gentle nudges for placeholder content still on the site.
  const todos = [
    content.profile.email.endsWith("@example.com") && { href: "/admin/content/profile", text: "Add the real office email and phone" },
    content.profile.portrait.startsWith("/images/") && { href: "/admin/content/profile", text: "Upload an official portrait photo" },
    [content.profile.facebook, content.profile.x, content.profile.instagram, content.profile.youtube].some(
      (u) => /^https:\/\/(www\.)?(facebook|x|instagram|youtube)\.com\/?$/.test(u),
    ) && { href: "/admin/content/profile", text: "Link the real social media profiles" },
    content.press.some((p) => !p.href || p.href === "#") && { href: "/admin/content/press", text: "Replace sample press items" },
    content.events.some((e) => e.date === "—") && { href: "/admin/content/events", text: "Add dates to events" },
    photos.length === 0 && { href: "/admin/photos", text: "Import the built-in gallery photos so they can be edited" },
    posts.length === 0 && { href: "/admin/blog", text: "Publish the first blog post" },
  ].filter(Boolean) as { href: string; text: string }[];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-muted">Edit any part of the website below. Changes go live as soon as you save.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/photos" className={btn}>
            Upload photos
          </Link>
          <Link href="/admin/blog" className={btnGhost}>
            Write a post
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gallery photos" value={photos.length} href="/admin/photos" />
        <Stat label="Blog posts" value={posts.length} href="/admin/blog" />
        <Stat label={`Parliament questions · updated ${parliament.updated}`} value={parliament.questions.length} href="/admin/parliament" />
        <Stat label="Website sections" value={sections.length} href="/admin/content/profile" />
      </div>

      {todos.length > 0 && (
        <section className="rounded-2xl border border-saffron/50 bg-saffron/10 p-5">
          <h2 className="font-bold">Still to do before launch</h2>
          <ul className="mt-3 space-y-1.5">
            {todos.map((t) => (
              <li key={t.text}>
                <Link href={t.href} className="text-sm hover:text-accent hover:underline">
                  ○ {t.text} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold">Website sections</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((s, i) => (
            <Link
              key={s.key}
              href={`/admin/content/${s.key}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-saffron hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-saffron/15 text-sm font-bold text-accent">
                  {i + 1}
                </span>
                <h3 className="font-bold group-hover:text-accent">{s.title}</h3>
              </div>
              <p className="mt-2 flex-1 text-sm text-muted">{s.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted">{count(s.key)}</span>
                <span className="font-semibold text-accent">Edit →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-saffron">
      <div className="text-3xl font-bold text-accent">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </Link>
  );
}
