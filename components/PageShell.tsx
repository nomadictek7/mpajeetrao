import { breadcrumbs, JsonLd } from "@/lib/seo";
import Footer from "./Footer";
import Header from "./Header";

// Wraps a single-section page (/about, /press, …) with the header, footer and breadcrumb data.
export default function PageShell({ name, path, children }: { name: string; path: string; children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...breadcrumbs([["Home", "/"], [name, path]]) }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
