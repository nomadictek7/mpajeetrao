import { notFound } from "next/navigation";
import { Suspense } from "react";
import { sections } from "@/lib/editor-schema";
import { getSiteContent, type SectionKey } from "@/lib/site";
import SectionEditor from "./SectionEditor";

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.key }));
}

async function Editor({ params }: { params: PageProps<"/admin/content/[section]">["params"] }) {
  const { section } = await params;
  if (!sections.some((s) => s.key === section)) notFound();
  const content = await getSiteContent();
  // key forces a fresh editor when switching sections
  return <SectionEditor key={section} sectionKey={section} initial={content[section as SectionKey]} />;
}

export default function ContentSectionPage({ params }: PageProps<"/admin/content/[section]">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
