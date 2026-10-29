// Parliamentary record from the Rajya Sabha's public data (sansad.in).
// lib/parliament.json is the copy bundled with the site (scripts/fetch-parliament.mjs).
// "Refresh from Rajya Sabha" in /admin/parliament saves a newer copy to Redis
// key "parliament", which then takes precedence.

import { cacheLife, cacheTag } from "next/cache";
import bundled from "./parliament.json";
import { hasDb, redis } from "./store";

export type SessionAttendance = {
  session: number;
  name: string;
  start: string;
  end: string;
  sittings: number;
  attended: number;
  houseAverage: number;
};

export type Question = {
  id: number;
  session: number;
  number: string;
  type: "starred" | "unstarred";
  date: string;
  ministry: string;
  title: string;
  text: string;
  pdf: string;
  pdfHindi: string;
};

export type ParliamentData = {
  updated: string;
  member: number;
  attendance: SessionAttendance[];
  questions: Question[];
};

export async function getParliament(): Promise<ParliamentData & { source: "refreshed" | "bundled" }> {
  "use cache";
  cacheLife("hours");
  cacheTag("parliament");
  const saved = hasDb() ? await redis().get<ParliamentData>("parliament") : null;
  // Keep whichever copy is newer, so a redeploy with a fresh JSON file isn't hidden by an old refresh.
  if (saved && saved.updated >= bundled.updated) return { ...saved, source: "refreshed" };
  return { ...(bundled as ParliamentData), source: "bundled" };
}

export const saveParliament = (data: ParliamentData) => redis().set("parliament", data);

export const sessionLabel = (s: Pick<SessionAttendance, "name" | "start">) => `${s.name} ${s.start.slice(0, 4)}`;

// The small summary the homepage needs, so it doesn't ship every question.
export type ParliamentSummary = ReturnType<typeof summarise>;

export function summarise({ updated, attendance, questions }: ParliamentData) {
  const sittings = attendance.reduce((n, s) => n + s.sittings, 0);
  const attended = attendance.reduce((n, s) => n + s.attended, 0);
  const houseAttended = attendance.reduce((n, s) => n + s.houseAverage, 0);
  const byMinistry = new Map<string, number>();
  for (const q of questions) byMinistry.set(q.ministry, (byMinistry.get(q.ministry) ?? 0) + 1);
  const bySession = new Map<number, number>();
  for (const q of questions) bySession.set(q.session, (bySession.get(q.session) ?? 0) + 1);
  return {
    updated,
    sittings,
    attended,
    attendancePct: Math.round((attended / sittings) * 100),
    housePct: Math.round((houseAttended / sittings) * 100),
    questions: questions.length,
    starred: questions.filter((q) => q.type === "starred").length,
    ministries: byMinistry.size,
    topMinistries: [...byMinistry].sort((a, b) => b[1] - a[1]).slice(0, 6),
    sessions: attendance.map((s) => ({
      label: sessionLabel(s),
      sittings: s.sittings,
      attended: s.attended,
      houseAverage: s.houseAverage,
      questions: bySession.get(s.session) ?? 0,
    })),
  };
}
