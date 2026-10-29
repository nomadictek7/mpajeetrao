import type { Metadata } from "next";
import { ParliamentStats } from "@/components/Parliament";
import PageShell from "@/components/PageShell";
import { getParliament, summarise } from "@/lib/parliament";

export const metadata: Metadata = {
  title: "Parliament",
  description:
    "Dr. Ajeet Gopchade's record in the Rajya Sabha — attendance by session, questions asked and the ministries he questions most.",
  alternates: { canonical: "/parliament" },
  openGraph: { url: "/parliament", title: "Parliament | Dr. Ajeet Gopchade, MP" },
};

export default async function ParliamentPage() {
  const parliament = await getParliament();
  return (
    <PageShell name="Parliament" path="/parliament">
      <ParliamentStats s={summarise(parliament)} />
    </PageShell>
  );
}
