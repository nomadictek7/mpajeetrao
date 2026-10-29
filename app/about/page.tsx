import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { About } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Dr. Ajeet (Ajit) Gopchade — paediatrician from Nanded and BJP Member of Parliament in the Rajya Sabha from Maharashtra.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About | Dr. Ajeet Gopchade, MP" },
};

export default function AboutPage() {
  return (
    <PageShell name="About" path="/about">
      <About />
    </PageShell>
  );
}
