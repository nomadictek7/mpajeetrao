"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { refreshParliament } from "../../actions";
import { btn } from "../../ui";

export default function RefreshButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        disabled={pending}
        className={btn}
        onClick={() =>
          start(async () => {
            setStatus(null);
            const res = await refreshParliament();
            if ("error" in res) return setStatus({ kind: "err", text: res.error ?? "Could not refresh." });
            setStatus({ kind: "ok", text: `Updated: ${res.sessions} sessions, ${res.questions} questions. The website is updated.` });
            router.refresh();
          })
        }
      >
        {pending ? "Fetching from Rajya Sabha… (up to a minute)" : "Refresh from Rajya Sabha"}
      </button>
      {status && (
        <p role="status" className={`text-sm ${status.kind === "ok" ? "text-green" : "text-red-600"}`}>
          {status.text}
        </p>
      )}
    </div>
  );
}
