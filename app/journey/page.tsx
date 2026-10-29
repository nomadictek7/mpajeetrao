import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Journey } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "The journey of Dr. Ajeet Gopchade from paediatrician in Nanded to Member of Parliament, Rajya Sabha.",
  alternates: { canonical: "/journey" },
  openGraph: { url: "/journey", title: "Journey | Dr. Ajeet Gopchade, MP" },
};

export default function JourneyPage() {
  return (
    <PageShell name="Journey" path="/journey">
      <Journey />
    </PageShell>
  );
}
