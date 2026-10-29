"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { sectionByKey, type Field } from "@/lib/editor-schema";
import { resetSection, saveSection } from "../../../actions";
import { btn, btnGhost, field as input } from "../../../ui";

/* eslint-disable @typescript-eslint/no-explicit-any */
type V = any;

const get = (v: V, key: string) => (key ? v?.[key] : v);
const set = (v: V, key: string, x: V) => (key ? { ...v, [key]: x } : x);

export default function SectionEditor({ sectionKey, initial }: { sectionKey: string; initial: V }) {
  const def = sectionByKey(sectionKey)!;
  const router = useRouter();
  const [saved, setSaved] = useState<V>(initial);
  const [value, setValue] = useState<V>(initial);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    addEventListener("beforeunload", h);
    return () => removeEventListener("beforeunload", h);
  }, [dirty]);

  function save() {
    start(async () => {
      const res = await saveSection(def.key, value);
      if ("error" in res) return setStatus({ kind: "err", text: res.error ?? "Could not save." });
      setSaved(res.value);
      setValue(res.value);
      setStatus({ kind: "ok", text: "Saved. The website is updated." });
      router.refresh();
    });
  }

  function restore() {
    if (!confirm(`Restore “${def.title}” to the original content? Your edits to this section will be lost.`)) return;
    start(async () => {
      const res = await resetSection(def.key);
      if ("error" in res) return setStatus({ kind: "err", text: res.error ?? "Could not restore." });
      setSaved(res.value);
      setValue(res.value);
      setStatus({ kind: "ok", text: "Restored to the original content." });
      router.refresh();
    });
  }

  return (
    <div className="pb-24">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{def.title}</h1>
          <p className="mt-1 text-muted">{def.description}</p>
        </div>
        <Link href={def.anchor} target="_blank" className={btnGhost}>
          View on website ↗
        </Link>
      </div>

      <div className="space-y-6">
        {def.fields.map((f) => (
          <FieldInput key={f.key || f.label} f={f} value={get(value, f.key)} onChange={(x) => setValue((v: V) => set(v, f.key, x))} />
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 lg:pl-72">
          <button onClick={save} disabled={!dirty || pending} className={btn}>
            {pending ? "Saving…" : "Save changes"}
          </button>
          <button onClick={() => { setValue(saved); setStatus(null); }} disabled={!dirty || pending} className={`${btnGhost} disabled:opacity-50`}>
            Discard
          </button>
          <span className="text-sm" role="status">
            {dirty ? (
              <span className="font-semibold text-accent">● Unsaved changes</span>
            ) : status ? (
              <span className={status.kind === "ok" ? "text-green" : "text-red-600"}>{status.text}</span>
            ) : null}
          </span>
          <button onClick={restore} disabled={pending} className="ml-auto text-sm text-muted underline-offset-2 hover:text-red-600 hover:underline">
            Restore original
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: V; onChange: (v: V) => void }) {
  const id = useId();
  const label = (
    <div className="mb-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {f.label}
      </label>
      {f.help && <span className="ml-2 text-xs text-muted">{f.help}</span>}
    </div>
  );

  switch (f.kind) {
    case "text":
    case "url":
    case "email":
      return (
        <div>
          {label}
          <input
            id={id}
            type={f.kind === "url" ? "url" : f.kind === "email" ? "email" : "text"}
            placeholder={f.kind === "url" ? "https://…" : ""}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={input}
          />
        </div>
      );
    case "bi":
    case "biArea": {
      const Tag = f.kind === "bi" ? "input" : "textarea";
      const v = value ?? { en: "", mr: "" };
      return (
        <div>
          {label}
          <div className="grid gap-3 md:grid-cols-2">
            {(["en", "mr"] as const).map((lang) => (
              <div key={lang} className="relative">
                <span className="pointer-events-none absolute right-3 top-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {lang === "en" ? "English" : "मराठी"}
                </span>
                <Tag
                  id={lang === "en" ? id : undefined}
                  aria-label={`${f.label} (${lang === "en" ? "English" : "Marathi"})`}
                  rows={f.kind === "biArea" ? 4 : undefined}
                  value={v[lang] ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...v, [lang]: e.target.value })}
                  className={`${input} pr-20`}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "image":
      return (
        <div>
          {label}
          <ImageInput id={id} value={value ?? ""} onChange={onChange} />
        </div>
      );
    case "list":
      return <ListInput f={f} value={Array.isArray(value) ? value : []} onChange={onChange} />;
  }
}

function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-line bg-surface p-3">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-24 w-24 rounded-lg object-cover" />
      ) : (
        <div className="grid h-24 w-24 place-items-center rounded-lg bg-surface-2 text-xs text-muted">No image</div>
      )}
      <div className="space-y-2">
        <label className={`${btnGhost} inline-block cursor-pointer text-sm`}>
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setErr("");
              try {
                const blob = await upload(`site/${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
                onChange(blob.url);
              } catch (x) {
                setErr((x as Error).message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="ml-2 text-sm text-red-600 hover:underline">
            Remove
          </button>
        )}
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>
    </div>
  );
}

function ListInput({ f, value, onChange }: { f: Extract<Field, { kind: "list" }>; value: V[]; onChange: (v: V[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open === j ? i : open);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {f.label} <span className="font-normal text-muted">({value.length})</span>
        </h2>
      </div>
      <ol className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open === i;
          const summary = f.summary(item as never) || `Untitled ${f.itemName}`;
          return (
            <li key={i} className={`rounded-xl border bg-surface ${isOpen ? "border-saffron" : "border-line"}`}>
              <div className="flex items-center gap-2 p-2 pl-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold text-muted">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="min-w-0 flex-1 truncate text-left font-medium hover:text-accent"
                >
                  {summary}
                </button>
                <IconBtn label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)} disabled={i === value.length - 1}>↓</IconBtn>
                <IconBtn label={isOpen ? "Collapse" : "Edit"} onClick={() => setOpen(isOpen ? null : i)}>
                  {isOpen ? "▴" : "✎"}
                </IconBtn>
                <IconBtn
                  label="Delete"
                  danger
                  onClick={() => {
                    if (!confirm(`Delete this ${f.itemName}?`)) return;
                    onChange(value.filter((_, j) => j !== i));
                    setOpen(null);
                  }}
                >
                  ✕
                </IconBtn>
              </div>
              {isOpen && (
                <div className="space-y-4 border-t border-line p-4">
                  {f.item.map((sf) => (
                    <FieldInput
                      key={sf.key || sf.label}
                      f={sf}
                      value={get(item, sf.key)}
                      onChange={(x) => onChange(value.map((it, j) => (j === i ? set(it, sf.key, x) : it)))}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => {
          onChange([...value, f.newItem()]);
          setOpen(value.length);
        }}
        className="mt-3 w-full rounded-xl border-2 border-dashed border-line py-3 text-sm font-semibold text-muted hover:border-saffron hover:text-accent"
      >
        + Add {f.itemName}
      </button>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm disabled:opacity-30 ${
        danger ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950" : "text-muted hover:bg-surface-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
