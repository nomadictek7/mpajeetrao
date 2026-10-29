"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ui } from "@/lib/content";
import type { ParliamentSummary, Question } from "@/lib/parliament";
import { usePrefs } from "./Prefs";
import { useSite } from "./SiteContent";
import { formatDate } from "./Sections";

function SourceNote({ updated }: { updated: string }) {
  const { t, lang } = usePrefs();
  return (
    <p className="mt-6 text-sm text-muted">
      {t(ui.sourceNote)} {formatDate(updated, lang)}.
    </p>
  );
}

// Homepage section: headline numbers, attendance per session and the ministries he questions most.
export function ParliamentStats({ s }: { s: ParliamentSummary }) {
  const { t } = usePrefs();
  const { labels } = useSite();
  const tiles = [
    { value: `${s.attendancePct}%`, label: t(ui.attendance), note: `${s.attended}/${s.sittings} ${t(ui.sittingsAttended)}` },
    { value: `${s.housePct}%`, label: t(ui.houseAverage), note: t(ui.houseNote) },
    { value: String(s.questions), label: t(ui.questionsAsked), note: `${s.starred} ${t(ui.starred)} · ${s.questions - s.starred} ${t(ui.unstarred)}` },
    { value: String(s.ministries), label: t(ui.ministriesCovered), note: `${s.sessions.length} ${t(ui.sessionsAttended)}` },
  ];
  const maxMinistry = s.topMinistries[0]?.[1] ?? 1;

  return (
    <section id="parliament" className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold md:text-4xl">{t(labels.parliament)}</h2>
        <div className="mt-3 h-1 w-16 rounded bg-saffron" />
        <p className="mt-4 max-w-2xl text-lg text-ink/80">{t(labels.parliamentSub)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((x) => (
          <div key={x.label} className="rounded-2xl border border-line bg-surface p-5">
            <div className="font-display text-4xl font-bold text-accent">{x.value}</div>
            <div className="mt-1 font-semibold">{x.label}</div>
            <div className="mt-1 text-sm text-muted">{x.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-semibold">{t(ui.bySession)}</h3>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-saffron" />{t(ui.him)}</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-0.5 bg-ink" />{t(ui.houseAverage)}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {s.sessions.map((x) => {
              const pct = Math.round((x.attended / x.sittings) * 100);
              return (
                <li key={x.label}>
                  <div className="flex justify-between gap-2 text-sm">
                    <span>{x.label}</span>
                    <span className="font-semibold tabular-nums">
                      {x.attended}/{x.sittings} · {pct}%
                    </span>
                  </div>
                  <div className="relative mt-1 h-2.5 rounded-full bg-surface-2" aria-hidden>
                    <div className="h-full rounded-full bg-saffron" style={{ width: `${pct}%` }} />
                    <div
                      className="absolute -top-0.5 h-3.5 w-0.5 bg-ink"
                      style={{ left: `${(x.houseAverage / x.sittings) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-semibold">{t(ui.topMinistries)}</h3>
          <ul className="mt-4 space-y-3">
            {s.topMinistries.map(([name, n]) => (
              <li key={name}>
                <div className="flex justify-between gap-2 text-sm">
                  <span>{name}</span>
                  <span className="font-semibold tabular-nums">{n}</span>
                </div>
                <div className="mt-1 h-2.5 rounded-full bg-surface-2" aria-hidden>
                  <div className="h-full rounded-full bg-green" style={{ width: `${(n / maxMinistry) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/questions"
            className="mt-6 inline-block rounded-xl bg-saffron px-5 py-3 font-semibold text-on-brand hover:bg-saffron-deep"
          >
            {t(ui.allQuestions)} ({s.questions}) →
          </Link>
        </div>
      </div>
      <SourceNote updated={s.updated} />
    </section>
  );
}

// Full list on /questions with search and filters.
export function QuestionList({
  questions,
  sessions,
  updated,
}: {
  questions: Question[];
  sessions: { session: number; label: string }[];
  updated: string;
}) {
  const { t, lang } = usePrefs();
  const { labels } = useSite();
  const [query, setQuery] = useState("");
  const [session, setSession] = useState("");
  const [ministry, setMinistry] = useState("");
  const [type, setType] = useState("");
  const ministries = useMemo(() => [...new Set(questions.map((q) => q.ministry))].sort(), [questions]);
  const sessionName = new Map(sessions.map((s) => [s.session, s.label]));

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = questions.filter(
    (q) =>
      (!session || q.session === Number(session)) &&
      (!ministry || q.ministry === ministry) &&
      (!type || q.type === type) &&
      words.every((w) => `${q.title} ${q.text} ${q.ministry}`.toLowerCase().includes(w)),
  );
  const field = "rounded-xl border border-line bg-surface px-4 py-2.5 outline-none focus:border-saffron";

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
      <h1 className="font-display text-4xl font-bold md:text-5xl">{t(labels.questionsTitle)}</h1>
      <div className="mt-3 h-1 w-16 rounded bg-saffron" />
      <p className="mt-4 text-lg text-ink/80">{t(labels.questionsIntro)}</p>

      <div className="mt-8 grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <input
          type="search"
          aria-label={t(ui.search)}
          placeholder={t(ui.search)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={field}
        />
        <select aria-label={t(ui.allSessions)} value={session} onChange={(e) => setSession(e.target.value)} className={field}>
          <option value="">{t(ui.allSessions)}</option>
          {sessions.map((s) => (
            <option key={s.session} value={s.session}>{s.label}</option>
          ))}
        </select>
        <select aria-label={t(ui.allMinistries)} value={ministry} onChange={(e) => setMinistry(e.target.value)} className={field}>
          <option value="">{t(ui.allMinistries)}</option>
          {ministries.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select aria-label={t(ui.allTypes)} value={type} onChange={(e) => setType(e.target.value)} className={field}>
          <option value="">{t(ui.allTypes)}</option>
          <option value="starred">{t(ui.starred)}</option>
          <option value="unstarred">{t(ui.unstarred)}</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-muted" role="status">
        {t(ui.showing)} {shown.length} {t(ui.of)} {questions.length}
      </p>

      {shown.length === 0 ? (
        <p className="mt-8 text-lg text-muted">{t(ui.noMatches)}</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {shown.map((q) => (
            <li key={q.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{formatDate(q.date, lang)}</span>
                <span>·</span>
                <span>{sessionName.get(q.session)}</span>
                <span>·</span>
                <span>{t(ui.questionNo)} {q.number}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    q.type === "starred" ? "bg-saffron text-on-brand" : "bg-surface-2 text-ink"
                  }`}
                >
                  {t(q.type === "starred" ? ui.starred : ui.unstarred)}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold">{q.title}</h2>
              <p className="text-sm font-medium text-accent">{q.ministry}</p>
              {q.text && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-accent hover:underline">
                    {t(ui.readMore)}
                  </summary>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-ink/85">{q.text}</p>
                </details>
              )}
              {q.pdf && (
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                  <a href={q.pdf} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {t(ui.answerPdf)} ↗
                  </a>
                  {q.pdfHindi && (
                    <a href={q.pdfHindi} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                      {t(ui.hindiPdf)} ↗
                    </a>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
      <SourceNote updated={updated} />
    </section>
  );
}
