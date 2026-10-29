"use client";

import Link from "next/link";
import { ui } from "@/lib/content";
import type { Post } from "@/lib/store";
import { usePrefs } from "./Prefs";
import { PostCard, formatDate } from "./Sections";

export function BlogIndex({ posts }: { posts: Post[] }) {
  const { t } = usePrefs();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      <h1 className="font-display text-4xl font-bold md:text-5xl">{t(ui.blog)}</h1>
      <div className="mb-10 mt-3 h-1 w-16 rounded bg-saffron" />
      {posts.length === 0 ? (
        <p className="text-lg text-muted">{t(ui.noPosts)}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export function BlogPost({ post }: { post: Post }) {
  const { t, lang } = usePrefs();
  // Fall back to English when a Marathi version wasn't written.
  const title = t(post.title) || post.title.en;
  const body = t(post.body) || post.body.en;
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
      <Link href="/blog" className="text-sm font-semibold text-accent hover:underline">
        {t(ui.backToBlog)}
      </Link>
      <div className="mt-6 text-sm text-muted">{formatDate(post.date, lang)}</div>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
      <div className="mt-4 h-1 w-16 rounded bg-saffron" />
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt={title} className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
      )}
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
        {body
          .split(/\n\s*\n/)
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
      </div>
    </article>
  );
}
