"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { gallery, galleryCategories } from "@/lib/content";
import type { Photo } from "@/lib/store";
import { addPhoto, deletePhoto, importDefaultPhotos, updatePhoto } from "../../actions";
import { btn, btnGhost, field } from "../../ui";

export default function PhotoManager({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [cat, setCat] = useState(galleryCategories[0].id);
  const [captionEn, setCaptionEn] = useState("");
  const [captionMr, setCaptionMr] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!files.length) return;
    const form = e.currentTarget;
    setBusy(true);
    try {
      for (const [n, file] of files.entries()) {
        setStatus(`Uploading ${n + 1} of ${files.length}…`);
        const blob = await upload(`gallery/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });
        await addPhoto({ url: blob.url, cat, captionEn, captionMr });
      }
      setStatus(`Uploaded ${files.length} photo${files.length > 1 ? "s" : ""}.`);
      setFiles([]);
      setCaptionEn("");
      setCaptionMr("");
      form.reset();
      router.refresh();
    } catch (err) {
      setStatus(`Upload failed: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  const shown = filter === "all" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <div className="space-y-8">
      {photos.length === 0 && <ImportBuiltIn onDone={() => router.refresh()} />}
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-xl font-bold">Upload photos</h2>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Images (JPG, PNG, WebP — up to 20 MB each)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            required
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-saffron file:px-3 file:py-2 file:font-semibold file:text-on-brand"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Category</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
              {galleryCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label.en}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Caption (English)</span>
            <input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-muted">Caption (Marathi)</span>
            <input value={captionMr} onChange={(e) => setCaptionMr(e.target.value)} className={field} />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button disabled={busy || !files.length} className={btn}>
            {busy ? "Uploading…" : "Upload"}
          </button>
          {status && (
            <p role="status" className="text-sm text-muted">
              {status}
            </p>
          )}
        </div>
      </form>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="mr-3 text-xl font-bold">Gallery ({photos.length})</h2>
          {[{ id: "all", label: { en: "All" } }, ...galleryCategories].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                filter === c.id ? "bg-saffron text-on-brand" : "border border-line bg-surface"
              }`}
            >
              {c.label.en}
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p className="text-muted">No photos yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <PhotoCard key={p.id} photo={p} onChange={() => router.refresh()} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Until the gallery has its own photos, the website shows the built-in set from
// lib/content.ts. The first upload replaces all of them, so offer to import first.
function ImportBuiltIn({ onDone }: { onDone: () => void }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  const builtIn = gallery.filter((g) => g.src);
  return (
    <section className="rounded-2xl border border-saffron/50 bg-saffron/10 p-5">
      <h2 className="font-bold">The website is showing {builtIn.length} built-in photos</h2>
      <p className="mt-1 text-sm">
        Import them to edit their captions, change categories or remove some. If you upload new photos without
        importing, the built-in ones will disappear from the website.
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {builtIn.map((g) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={g.src} src={g.src} alt={g.caption.en} className="h-14 w-20 shrink-0 rounded-lg object-cover" />
        ))}
      </div>
      <button
        disabled={pending}
        className={`${btn} mt-4`}
        onClick={() =>
          start(async () => {
            try {
              await importDefaultPhotos();
              onDone();
            } catch (e) {
              setErr((e as Error).message);
            }
          })
        }
      >
        {pending ? "Importing…" : `Import ${builtIn.length} photos`}
      </button>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </section>
  );
}

function PhotoCard({ photo, onChange }: { photo: Photo; onChange: () => void }) {
  const [editing, setEditing] = useState(false);
  const [cat, setCat] = useState(photo.cat);
  const [en, setEn] = useState(photo.caption.en);
  const [mr, setMr] = useState(photo.caption.mr);
  const [pending, start] = useTransition();

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.caption.en} className="aspect-[4/3] w-full object-cover" />
      <figcaption className="space-y-2 p-3 text-sm">
        {editing ? (
          <>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
              {galleryCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label.en}
                </option>
              ))}
            </select>
            <input value={en} onChange={(e) => setEn(e.target.value)} placeholder="Caption (English)" className={field} />
            <input value={mr} onChange={(e) => setMr(e.target.value)} placeholder="Caption (Marathi)" className={field} />
          </>
        ) : (
          <>
            <div className="font-semibold">{photo.caption.en || <span className="text-muted">No caption</span>}</div>
            {photo.caption.mr && <div>{photo.caption.mr}</div>}
            <div className="text-xs text-muted">
              {galleryCategories.find((c) => c.id === photo.cat)?.label.en} ·{" "}
              {new Date(photo.createdAt).toLocaleDateString("en-IN")}
            </div>
          </>
        )}
        <div className="flex gap-2 pt-1">
          {editing ? (
            <>
              <button
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    await updatePhoto({ id: photo.id, cat, captionEn: en, captionMr: mr });
                    setEditing(false);
                    onChange();
                  })
                }
                className={btn}
              >
                Save
              </button>
              <button onClick={() => setEditing(false)} className={btnGhost}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className={btnGhost}>
                Edit
              </button>
              <button
                disabled={pending}
                onClick={() => {
                  if (!confirm("Delete this photo permanently?")) return;
                  start(async () => {
                    await deletePhoto(photo.id);
                    onChange();
                  });
                }}
                className="rounded-xl border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {pending ? "…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
