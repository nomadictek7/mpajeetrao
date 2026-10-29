// Fetches the MP's parliamentary record from the Rajya Sabha's public data
// services (the same ones sansad.in uses). Shared by the admin "Refresh" button
// and scripts/fetch-parliament.mjs, so it uses only plain, erasable TypeScript.

import type { ParliamentData, Question, SessionAttendance } from "./parliament";

const MP = 2606; // Dr. Ajeet Madhavrao Gopchade's member number
const FIRST_SESSION = 264; // first session after taking office on 3 April 2024
const RS = "https://rsdoc.nic.in";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(path: string): Promise<any> {
  const res = await fetch(RS + path, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

// The question text arrives as HTML; keep its line breaks, drop the markup.
function plain(html: string) {
  if (!html || html === "None") return "";
  return html
    .replace(/<\/(p|div|li)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

// "ROAD TRANSPORT & HIGH WAYS " -> "Road Transport & Highways"
const titleCase = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/HIGH WAYS/i, "HIGHWAYS")
    .toLowerCase()
    .replace(/(^|[\s(&,-])([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(/ (And|Of|For|The) /g, (m) => m.toLowerCase());

export async function fetchParliament(): Promise<ParliamentData> {
  const sessions = ((await get("/membergetdata/getsession")) as any[])
    .filter((s) => Number(s.sessionno) >= FIRST_SESSION)
    .sort((a, b) => Number(a.sessionno) - Number(b.sessionno));

  const attendance: SessionAttendance[] = [];
  for (const s of sessions) {
    const all = (await get(`/MemberGetdata/GetMemberAttendance?session=${s.sessionno}`)) as any[];
    // Ministers and presiding officers are marked "M", "LOP", "HDC" instead of a count.
    const counts = all.map((m) => m.noofsittings).filter((n) => /^\d+$/.test(n)).map(Number);
    const mine = all.find((m) => m.mpsno === MP);
    if (!mine) continue;
    attendance.push({
      session: Number(s.sessionno),
      name: s.sessionname,
      start: s.period.slice(0, 10),
      end: (s.period4 || s.period2).slice(0, 10),
      sittings: s.totaldays,
      attended: Number(mine.noofsittings),
      houseAverage: Math.round((counts.reduce((a, b) => a + b, 0) / counts.length) * 10) / 10,
    });
  }

  const where = encodeURIComponent(`ses_no>=${FIRST_SESSION} and mp_code='${MP}'`);
  const questions: Question[] = ((await get(`/Question/Search_Questions?whereclause=${where}`)) as any[])
    .map((q) => ({
      id: q.qslno,
      session: Number(q.ses_no),
      number: String(Number(q.qno)),
      type: q.qtype.trim() === "STARRED" ? ("starred" as const) : ("unstarred" as const),
      date: q.adate.slice(0, 10),
      ministry: titleCase(q.min_name),
      title: q.qtitle.trim(),
      text: plain(q.qn_text),
      pdf: q.files && q.files !== "None" ? q.files : "",
      pdfHindi: q.hindifiles && q.hindifiles !== "None" ? q.hindifiles : "",
    }))
    .sort((a, b) => b.date.localeCompare(a.date) || Number(b.number) - Number(a.number));

  return { updated: new Date().toISOString().slice(0, 10), member: MP, attendance, questions };
}
