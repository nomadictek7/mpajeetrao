"use server";

import { Ratelimit } from "@upstash/ratelimit";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import {
  SESSION_COOKIE,
  SESSION_HOURS,
  checkAccessCode,
  createSession,
  verifySession,
} from "@/lib/auth";
import {
  deletePhotoRecord,
  deletePostRecord,
  getPhotos,
  getPosts,
  isOwnBlobUrl,
  redis,
  savePhotoRecord,
  savePostRecord,
  type Post,
} from "@/lib/store";
import { gallery, galleryCategories } from "@/lib/content";
import { saveParliament } from "@/lib/parliament";
import { fetchParliament } from "@/lib/rajya-sabha";
import { cleanSection, defaultContent, writeSection, type SectionKey } from "@/lib/site";

async function requireAdmin() {
  const ok = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

// 5 wrong codes per IP per 15 minutes.
let limiter: Ratelimit | null = null;
const loginLimiter = () =>
  (limiter ??= new Ratelimit({ redis: redis(), limiter: Ratelimit.fixedWindow(5, "15 m"), prefix: "login-fail" }));

export async function login(_: unknown, form: FormData) {
  const code = String(form.get("code") ?? "").trim();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const { remaining } = await loginLimiter().getRemaining(ip);
  if (remaining <= 0) return { error: "Too many wrong attempts. Try again in 15 minutes." };
  if (!checkAccessCode(code)) {
    await loginLimiter().limit(ip); // count the failure
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Incorrect access code." };
  }
  (await cookies()).set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

const str = (v: unknown, max = 20000) => String(v ?? "").trim().slice(0, max);

export async function addPhoto(input: { url: string; cat: string; captionEn: string; captionMr: string }) {
  await requireAdmin();
  if (!isOwnBlobUrl(input.url)) throw new Error("Invalid image URL");
  const cat = galleryCategories.some((c) => c.id === input.cat) ? input.cat : galleryCategories[0].id;
  await savePhotoRecord({
    id: crypto.randomUUID(),
    url: input.url,
    cat,
    caption: { en: str(input.captionEn, 200), mr: str(input.captionMr, 200) },
    createdAt: new Date().toISOString(),
  });
  updateTag("photos");
}

// Copies the built-in gallery (lib/content.ts) into the photo store so it can
// be edited. The website shows the built-in photos only while the store is empty.
export async function importDefaultPhotos() {
  await requireAdmin();
  const have = new Set((await getPhotos()).map((p) => p.url));
  const now = Date.now();
  // Newest first on the site, so count createdAt down to keep the original order.
  const added = gallery.filter((g) => g.src && !have.has(g.src));
  for (const [n, g] of added.entries()) {
    await savePhotoRecord({
      id: crypto.randomUUID(),
      url: g.src!,
      cat: g.cat,
      caption: g.caption,
      createdAt: new Date(now - n * 1000).toISOString(),
    });
  }
  updateTag("photos");
  return { added: added.length };
}

export async function updatePhoto(input: { id: string; cat: string; captionEn: string; captionMr: string }) {
  await requireAdmin();
  const photo = (await getPhotos()).find((p) => p.id === input.id);
  if (!photo) throw new Error("Photo not found");
  await savePhotoRecord({
    ...photo,
    cat: galleryCategories.some((c) => c.id === input.cat) ? input.cat : photo.cat,
    caption: { en: str(input.captionEn, 200), mr: str(input.captionMr, 200) },
  });
  updateTag("photos");
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const photo = (await getPhotos()).find((p) => p.id === id);
  if (photo) await deletePhotoRecord(photo);
  updateTag("photos");
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || `post-${Date.now()}`
  );
}

export type PostInput = {
  originalSlug?: string;
  titleEn: string;
  titleMr: string;
  excerptEn: string;
  excerptMr: string;
  bodyEn: string;
  bodyMr: string;
  date: string;
  cover?: string;
};

export async function savePost(input: PostInput) {
  await requireAdmin();
  const titleEn = str(input.titleEn, 200);
  if (!titleEn || !str(input.bodyEn)) return { error: "English title and body are required." };
  if (input.cover && !isOwnBlobUrl(input.cover)) return { error: "Invalid cover image." };

  const posts = await getPosts();
  const existing = input.originalSlug ? posts.find((p) => p.slug === input.originalSlug) : undefined;

  let slug = existing?.slug ?? slugify(titleEn);
  if (!existing) {
    const base = slug;
    for (let n = 2; posts.some((p) => p.slug === slug); n++) slug = `${base}-${n}`;
  }

  const post: Post = {
    slug,
    title: { en: titleEn, mr: str(input.titleMr, 200) },
    excerpt: { en: str(input.excerptEn, 400), mr: str(input.excerptMr, 400) },
    body: { en: str(input.bodyEn), mr: str(input.bodyMr) },
    cover: input.cover || undefined,
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : new Date().toISOString().slice(0, 10),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await savePostRecord(post);
  updateTag("posts");
  return { slug };
}

export async function deletePost(slug: string) {
  await requireAdmin();
  const post = (await getPosts()).find((p) => p.slug === slug);
  if (post) await deletePostRecord(post);
  updateTag("posts");
}

export async function refreshParliament() {
  await requireAdmin();
  try {
    const data = await fetchParliament();
    if (!data.attendance.length || !data.questions.length) {
      return { error: "The Rajya Sabha website returned no records. Nothing was changed — try again later." };
    }
    await saveParliament(data);
    updateTag("parliament");
    return { updated: data.updated, sessions: data.attendance.length, questions: data.questions.length };
  } catch (e) {
    return { error: `Could not reach the Rajya Sabha website (${(e as Error).message}). Nothing was changed — try again later.` };
  }
}

const isSection = (k: string): k is SectionKey => k in defaultContent;

export async function saveSection(key: string, value: unknown) {
  await requireAdmin();
  if (!isSection(key)) return { error: "Unknown section." };
  const cleaned = cleanSection(key, value);
  await writeSection(key, cleaned);
  updateTag("site");
  return { value: cleaned };
}

export async function resetSection(key: string) {
  await requireAdmin();
  if (!isSection(key)) return { error: "Unknown section." };
  await writeSection(key, null);
  updateTag("site");
  return { value: defaultContent[key] };
}
