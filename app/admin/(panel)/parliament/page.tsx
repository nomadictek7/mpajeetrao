import Link from "next/link";
import { getParliament, summarise } from "@/lib/parliament";
import { btnGhost } from "../../ui";
import RefreshButton from "./RefreshButton";

export default async function ParliamentPage() {
  const data = await getParliament();
  const s = summarise(data);
  const updated = new Date(`${data.updated}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "long" });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Parliament record</h1>
          <p className="mt-1 max-w-2xl text-muted">
            Attendance and questions shown in the “In Parliament” section and on the Questions page. The figures come
            straight from the Rajya Sabha website, so they can’t be typed in by hand — refresh them after each session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/parliament" target="_blank" className={btnGhost}>
            View on website ↗
          </Link>
          <Link href="/admin/content/labels" className={btnGhost}>
            Edit heading & intro
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="text-sm text-muted">Last updated</div>
        <div className="text-xl font-bold">{updated}</div>
        <p className="mt-1 text-sm text-muted">
          {data.source === "refreshed" ? "Refreshed from the admin panel." : "Copy bundled with the website."}
        </p>
        <div className="mt-4">
          <RefreshButton />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat value={`${s.attendancePct}%`} label="Attendance" note={`${s.attended}/${s.sittings} sittings`} />
        <Stat value={`${s.housePct}%`} label="House average" />
        <Stat value={String(s.questions)} label="Questions asked" note={`${s.starred} starred`} />
        <Stat value={String(s.ministries)} label="Ministries questioned" />
      </div>

      <section className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Attended</th>
              <th className="px-4 py-3 font-semibold">House average</th>
              <th className="px-4 py-3 font-semibold">Questions</th>
            </tr>
          </thead>
          <tbody>
            {[...s.sessions].reverse().map((x) => (
              <tr key={x.label} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{x.label}</td>
                <td className="px-4 py-3 tabular-nums">
                  {x.attended}/{x.sittings}
                </td>
                <td className="px-4 py-3 tabular-nums">{x.houseAverage}</td>
                <td className="px-4 py-3 tabular-nums">{x.questions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="text-3xl font-bold text-accent">{value}</div>
      <div className="mt-1 text-sm font-semibold">{label}</div>
      {note && <div className="text-xs text-muted">{note}</div>}
    </div>
  );
}
