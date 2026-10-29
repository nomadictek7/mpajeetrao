// Social media feeds for /social. Only official, key-free sources are used:
// YouTube's public RSS feed here, and the Facebook Page Plugin, X timeline
// widget and per-post embeds in components/Social.tsx.

import { cacheLife, cacheTag } from "next/cache";
import { site } from "./content";

export type Video = { id: string; title: string; published: string };

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    e[0] === "#" ? String.fromCodePoint(parseInt(e.slice(1).replace(/^x/i, "0x"))) : (entities[e] ?? m),
  );

export async function getYouTubeVideos(limit = 6): Promise<Video[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("youtube");
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.youtubeChannelId}`);
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, limit).map(([, e]) => ({
      id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "",
      title: decode(e.match(/<title>([^<]*)/)?.[1] ?? "").trim(),
      published: e.match(/<published>([^<]+)/)?.[1]?.slice(0, 10) ?? "",
    })).filter((v) => v.id);
  } catch {
    // The page still renders the profile links if YouTube is unreachable.
    return [];
  }
}

export type Embed =
  | { kind: "x"; id: string }
  | { kind: "iframe"; network: "instagram" | "linkedin" | "facebook" | "youtube"; src: string; height: number };

// Turns a pasted post link into something the page can embed; unknown links are skipped.
export function toEmbed(url: string): Embed | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m|mobile)\./, "");
  if (host === "x.com" || host === "twitter.com") {
    const id = u.pathname.match(/\/status\/(\d+)/)?.[1];
    return id ? { kind: "x", id } : null;
  }
  if (host === "instagram.com") {
    const code = u.pathname.match(/^\/(?:[\w.]+\/)?(?:p|reel|tv)\/([\w-]+)/)?.[1];
    return code ? { kind: "iframe", network: "instagram", src: `https://www.instagram.com/p/${code}/embed/captioned/`, height: 720 } : null;
  }
  if (host === "linkedin.com") {
    // /feed/update/urn:li:activity:123…, /embed/feed/update/urn:li:share:123…, or /posts/name_slug-activity-123…
    const urn = decodeURIComponent(u.pathname).match(/urn:li:(activity|share|ugcPost):(\d+)/);
    const activity = u.pathname.match(/activity-(\d+)/)?.[1];
    const id = urn ? `urn:li:${urn[1]}:${urn[2]}` : activity ? `urn:li:activity:${activity}` : null;
    return id ? { kind: "iframe", network: "linkedin", src: `https://www.linkedin.com/embed/feed/update/${id}`, height: 600 } : null;
  }
  if (host === "facebook.com" || host === "fb.watch") {
    const video = /\/videos\/|\/watch|\/reel\/|fb\.watch/.test(url);
    const plugin = video ? "video" : "post";
    return { kind: "iframe", network: "facebook", src: `https://www.facebook.com/plugins/${plugin}.php?href=${encodeURIComponent(url)}&show_text=true&width=500`, height: video ? 420 : 640 };
  }
  if (host === "youtube.com" || host === "youtu.be") {
    const id = host === "youtu.be" ? u.pathname.slice(1) : (u.searchParams.get("v") ?? u.pathname.match(/\/(?:shorts|live|embed)\/([\w-]{11})/)?.[1]);
    return id && /^[\w-]{11}$/.test(id) ? { kind: "iframe", network: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}`, height: 280 } : null;
  }
  return null;
}
