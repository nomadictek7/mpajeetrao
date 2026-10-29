import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { SocialFeeds } from "@/components/Social";
import { getSiteContent } from "@/lib/site";
import { getYouTubeVideos, toEmbed, type Embed } from "@/lib/social";

export const metadata: Metadata = {
  title: "Social Media",
  description:
    "Latest updates from Dr. Ajeet Gopchade's official Facebook, X, Instagram, LinkedIn and YouTube accounts.",
  alternates: { canonical: "/social" },
  openGraph: { url: "/social", title: "Social Media | Dr. Ajeet Gopchade, MP" },
};

export default async function SocialPage() {
  const [videos, content] = await Promise.all([getYouTubeVideos(), getSiteContent()]);
  const embeds = content.social.map((p) => toEmbed(p.url)).filter((e): e is Embed => e !== null);
  return (
    <PageShell name="Social Media" path="/social">
      <SocialFeeds videos={videos} embeds={embeds} />
    </PageShell>
  );
}
