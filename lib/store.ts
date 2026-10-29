// Records live in Upstash Redis (strongly consistent, so a save is visible
// immediately):
//   hash "photos"  field <id>    -> Photo
//   hash "posts"   field <slug>  -> Post
//   hash "site"    field <key>   -> one website section (see lib/site.ts)
// Image files themselves are stored in Vercel Blob under gallery/, blog/, site/.
// Photos imported from the built-in gallery point at /images/gallery/ instead.

import { del } from "@vercel/blob";
import { Redis } from "@upstash/redis";
import { cacheLife, cacheTag } from "next/cache";
import type { Lang } from "./content";

type T = Record<Lang, string>;

export type Photo = {
  id: string;
  url: string;
  cat: string;
  caption: T;
  createdAt: string;
};

export type Post = {
  slug: string;
  title: T;
  excerpt: T;
  body: T; // plain text; blank lines separate paragraphs
  cover?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
};

let client: Redis | null = null;
export function redis() {
  if (!client) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error("KV_REST_API_URL / KV_REST_API_TOKEN are not set");
    client = new Redis({ url, token });
  }
  return client;
}

export const hasDb = () => !!process.env.KV_REST_API_URL;

async function all<X>(hash: string): Promise<X[]> {
  if (!hasDb()) return [];
  return Object.values((await redis().hgetall<Record<string, X>>(hash)) ?? {});
}

export async function getPhotos(): Promise<Photo[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("photos");
  const photos = await all<Photo>("photos");
  return photos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const posts = await all<Post>("posts");
  return posts.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export const savePhotoRecord = (p: Photo) => redis().hset("photos", { [p.id]: p });
export const savePostRecord = (p: Post) => redis().hset("posts", { [p.slug]: p });

export async function deletePhotoRecord(p: Photo) {
  await redis().hdel("photos", p.id);
  if (isOwnBlobUrl(p.url)) await del(p.url).catch(() => {}); // the record is gone either way
}

export async function deletePostRecord(p: Post) {
  await redis().hdel("posts", p.slug);
  if (p.cover) await del(p.cover).catch(() => {});
}

export function isOwnBlobUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
