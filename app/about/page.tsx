import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { About, Impact, Journey } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Dr. Ajeet (Ajit) Gopchade — paediatrician from Nanded and BJP Member of Parliament in the Rajya Sabha from Maharashtra: his work, initiatives and journey.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About | Dr. Ajeet Gopchade, MP" },
};

export default function AboutPage() {
  return (
    <PageShell name="About" path="/about">
      <About />
      <Impact />
      <Journey />
    </PageShell>
  );
}
