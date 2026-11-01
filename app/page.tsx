import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Events, LatestPosts } from "@/components/Sections";
import { homeJsonLd, JsonLd } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";
import { getPosts } from "@/lib/store";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// The other menu items (About, Parliament, Press, …) each have their own page.
export default async function Home() {
  const [posts, content] = await Promise.all([getPosts(), getSiteContent()]);
  return (
    <>
      <JsonLd data={homeJsonLd(content)} />
      <Header />
      <main>
        <Hero />
        <LatestPosts posts={posts} />
        <Events />
      </main>
      <Footer />
    </>
  );
}
