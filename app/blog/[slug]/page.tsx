import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlogPost } from "@/components/BlogViews";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { abs, breadcrumbs, JsonLd, personId } from "@/lib/seo";
import { getPost } from "@/lib/store";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  // Called here as well as in the page so a missing post gets a real 404 status.
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  return {
    title: post.title.en,
    description: post.excerpt.en || post.body.en.slice(0, 160),
    alternates: { canonical: path },
    // Without a cover, the site-wide share card (app/opengraph-image.jpg) is used.
    openGraph: {
      type: "article",
      url: path,
      title: post.title.en,
      description: post.excerpt.en,
      publishedTime: post.date,
      authors: ["Dr. Ajeet Gopchade"],
      ...(post.cover && { images: [post.cover] }),
    },
  };
}

// Posts are created at runtime from /admin, so the post body streams in
// behind the static header.
async function PostContent({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title.en,
        description: post.excerpt.en || undefined,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: post.body.mr ? ["en-IN", "mr-IN"] : "en-IN",
        image: abs(post.cover || "/opengraph-image.jpg"),
        mainEntityOfPage: abs(path),
        author: { "@id": personId, "@type": "Person", name: "Dr. Ajeet Madhavrao Gopchade" },
        publisher: { "@id": personId },
      },
      breadcrumbs([["Home", "/"], ["Blog", "/blog"], [post.title.en, path]]),
    ],
  };
  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPost post={post} />
    </>
  );
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20 text-muted">…</div>}>
          <PostContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
