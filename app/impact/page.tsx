import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Impact } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Impact",
  description: "The work and initiatives of Dr. Ajeet Gopchade, MP, across Nanded, Marathwada and Maharashtra.",
  alternates: { canonical: "/impact" },
  openGraph: { url: "/impact", title: "Impact | Dr. Ajeet Gopchade, MP" },
};

export default function ImpactPage() {
  return (
    <PageShell name="Impact" path="/impact">
      <Impact />
    </PageShell>
  );
}
