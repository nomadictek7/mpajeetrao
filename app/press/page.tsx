import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Press } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Press",
  description: "Press coverage and news about Dr. Ajeet Gopchade, Member of Parliament (Rajya Sabha) from Maharashtra.",
  alternates: { canonical: "/press" },
  openGraph: { url: "/press", title: "Press | Dr. Ajeet Gopchade, MP" },
};

export default function PressPage() {
  return (
    <PageShell name="Press" path="/press">
      <Press />
    </PageShell>
  );
}
