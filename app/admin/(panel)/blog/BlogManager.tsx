"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Post } from "@/lib/store";
import { deletePost, savePost, type PostInput } from "../../actions";
import { btn, btnGhost, field } from "../../ui";

const empty = (): PostInput => ({
  titleEn: "",
  titleMr: "",
  excerptEn: "",
  excerptMr: "",
  bodyEn: "",
  bodyMr: "",
  date: "", // server uses today when left blank
  cover: "",
});

const fromPost = (p: Post): PostInput => ({
  originalSlug: p.slug,
  titleEn: p.title.en,
  titleMr: p.title.mr,
  excerptEn: p.excerpt.en,
  excerptMr: p.excerpt.mr,
  bodyEn: p.body.en,
  bodyMr: p.body.mr,
  date: p.date,
  cover: p.cover ?? "",
});

export default function BlogManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [form, setForm] = useState<PostInput>(empty);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, start] = useTransition();
  const editing = !!form.originalSlug;

  const set = (k: keyof PostInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function uploadCover(file: File) {
    setUploading(true);
    setStatus("Uploading cover…");
    try {
      const blob = await upload(`blog/${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
      setForm((f) => ({ ...f, cover: blob.url }));
      setStatus("Cover uploaded.");
    } catch (err) {
      setStatus(`Cover upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await savePost(form);
      if ("error" in res) return setStatus(res.error ?? "Could not save.");
      setStatus(editing ? "Post updated." : "Post published.");
      setForm(empty());
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{editing ? "Edit post" : "New post"}</h2>
          {editing && (
            <button type="button" onClick={() => setForm(empty())} className="text-sm text-accent hover:underline">
              + New post instead
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title (English) *">
            <input required value={form.titleEn} onChange={set("titleEn")} className={field} />
          </Field>
          <Field label="Title (Marathi)">
            <input value={form.titleMr} onChange={set("titleMr")} className={field} />
          </Field>
          <Field label="Short summary (English)">
            <textarea rows={2} value={form.excerptEn} onChange={set("excerptEn")} className={field} />
          </Field>
          <Field label="Short summary (Marathi)">
            <textarea rows={2} value={form.excerptMr} onChange={set("excerptMr")} className={field} />
          </Field>
        </div>

        <Field label="Post (English) * — leave a blank line between paragraphs">
          <textarea required rows={10} value={form.bodyEn} onChange={set("bodyEn")} className={field} />
        </Field>
        <Field label="Post (Marathi)">
          <textarea rows={10} value={form.bodyMr} onChange={set("bodyMr")} className={field} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date (blank = today)">
            <input type="date" value={form.date} onChange={set("date")} className={field} />
          </Field>
          <Field label="Cover image (optional)">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-saffron file:px-3 file:py-2 file:font-semibold file:text-on-brand"
            />
          </Field>
        </div>
        {form.cover && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.cover} alt="" className="h-20 w-32 rounded-lg object-cover" />
            <button type="button" onClick={() => setForm((f) => ({ ...f, cover: "" }))} className="text-sm text-red-600">
              Remove cover
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button disabled={pending || uploading} className={btn}>
            {pending ? "Saving…" : editing ? "Save changes" : "Publish"}
          </button>
          {status && (
            <p role="status" className="text-sm text-muted">
              {status}
            </p>
          )}
        </div>
      </form>

      <section>
        <h2 className="mb-4 text-xl font-bold">Published ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-muted">No posts yet.</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.slug} className="rounded-2xl border border-line bg-surface p-4">
                <div className="text-xs text-muted">{p.date}</div>
                <div className="font-semibold">{p.title.en}</div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <button
                    onClick={() => {
                      setForm(fromPost(p));
                      setStatus("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={btnGhost}
                  >
                    Edit
                  </button>
                  <Link href={`/blog/${p.slug}`} target="_blank" className={btnGhost}>
                    View ↗
                  </Link>
                  <button
                    disabled={pending}
                    onClick={() => {
                      if (!confirm(`Delete "${p.title.en}" permanently?`)) return;
                      start(async () => {
                        await deletePost(p.slug);
                        if (form.originalSlug === p.slug) setForm(empty());
                        router.refresh();
                      });
                    }}
                    className="rounded-xl border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}
