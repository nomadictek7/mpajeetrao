import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { QuestionList } from "@/components/Parliament";
import { getParliament, sessionLabel } from "@/lib/parliament";
import { breadcrumbs, JsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { questions } = await getParliament();
  const title = "Questions in Parliament (Rajya Sabha)";
  const description = `All ${questions.length} questions raised by Dr. Ajeet (Ajit) Gopchade in the Rajya Sabha, with the government's written answers — searchable by session and ministry.`;
  return {
    title,
    description,
    alternates: { canonical: "/questions" },
    openGraph: { url: "/questions", title: `${title} | Dr. Ajeet Gopchade, MP`, description },
  };
}

export default async function QuestionsPage() {
  const { attendance, questions, updated } = await getParliament();
  const sessions = attendance.map((s) => ({ session: s.session, label: sessionLabel(s) })).reverse();
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...breadcrumbs([["Home", "/"], ["Questions in Parliament", "/questions"]]) }} />
      <Header />
      <main>
        <QuestionList questions={questions} sessions={sessions} updated={updated} />
      </main>
      <Footer />
    </>
  );
}
