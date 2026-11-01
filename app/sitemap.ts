import type { MetadataRoute } from "next";
import { getParliament } from "@/lib/parliament";
import { abs } from "@/lib/seo";
import { getPosts } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, parliament] = await Promise.all([getPosts(), getParliament()]);
  const latestPost = posts[0]?.date;
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    ...["/about", "/press", "/gallery", "/social", "/contact"].map((path) => ({
      url: abs(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: abs("/parliament"), lastModified: parliament.updated, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/questions"), lastModified: parliament.updated, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/blog"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: abs(`/blog/${p.slug}`),
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(p.cover && { images: [p.cover] }),
    })),
  ];
}
