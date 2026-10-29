import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Contact } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the office of Dr. Ajeet Gopchade, MP — email, phone and office addresses in New Delhi and Nanded.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact | Dr. Ajeet Gopchade, MP" },
};

export default function ContactPage() {
  return (
    <PageShell name="Contact" path="/contact">
      <Contact />
    </PageShell>
  );
}
