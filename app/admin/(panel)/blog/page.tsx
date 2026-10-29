import { getPosts } from "@/lib/store";
import BlogManager from "./BlogManager";

export default async function BlogAdminPage() {
  const posts = await getPosts();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold">Blog</h1>
      <BlogManager posts={posts} />
    </>
  );
}
