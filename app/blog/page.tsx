import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogViews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getPosts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles and updates from Dr. Ajeet (Ajit) Gopchade, Member of Parliament (Rajya Sabha) from Maharashtra, on his work in Parliament, Nanded and Marathwada.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Blog | Dr. Ajeet Gopchade, MP" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <Header />
      <main>
        <BlogIndex posts={posts} />
      </main>
      <Footer />
    </>
  );
}
