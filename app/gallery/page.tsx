import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { Gallery } from "@/components/Sections";
import { getPhotos } from "@/lib/store";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of Dr. Ajeet Gopchade, MP, at public events, in Parliament and across Maharashtra.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Gallery | Dr. Ajeet Gopchade, MP" },
};

export default async function GalleryPage() {
  const photos = await getPhotos();
  return (
    <PageShell name="Gallery" path="/gallery">
      <Gallery photos={photos} />
    </PageShell>
  );
}
