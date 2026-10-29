import type { Metadata } from "next";
import { Mukta, Noto_Sans_Devanagari, Playfair_Display } from "next/font/google";
import { PrefsProvider } from "@/components/Prefs";
import { SiteProvider } from "@/components/SiteContent";
import { keywords, siteUrl } from "@/lib/seo";
import { getSiteContent } from "@/lib/site";
import "./globals.css";

const body = Mukta({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const head = Playfair_Display({ variable: "--font-head", subsets: ["latin"], weight: ["600", "700"] });
const deva = Noto_Sans_Devanagari({ variable: "--font-deva", subsets: ["devanagari"], weight: ["400", "600", "700"] });

const title = "Dr. Ajeet Gopchade – Member of Parliament, Rajya Sabha (Maharashtra)";
const description =
  "Official website of Dr. Ajeet (Ajit) Madhavrao Gopchade, BJP Member of Parliament in the Rajya Sabha from Maharashtra and paediatrician from Nanded — work, parliamentary record, press, photos and contact. डॉ. अजित गोपछडे.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Dr. Ajeet Gopchade, MP" },
  description,
  keywords,
  applicationName: "Dr. Ajeet Gopchade",
  authors: [{ name: "Office of Dr. Ajeet Gopchade", url: siteUrl }],
  creator: "Office of Dr. Ajeet Gopchade",
  category: "politics",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    title,
    description,
    siteName: "Dr. Ajeet Gopchade",
    type: "profile",
    firstName: "Ajeet",
    lastName: "Gopchade",
    locale: "en_IN",
    alternateLocale: ["mr_IN"],
  },
  twitter: { card: "summary_large_image", title, description, site: "@Drajeetgopchade", creator: "@Drajeetgopchade" },
  // Set GOOGLE_SITE_VERIFICATION to the token from Google Search Console's "HTML tag" method.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

const prefsScript = `try{var d=document.documentElement,t=localStorage.getItem("theme");d.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(localStorage.getItem("large")==="1")d.style.fontSize="112.5%"}catch(e){}`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getSiteContent();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${head.variable} ${deva.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsScript }} />
      </head>
      <body className="min-h-full font-sans">
        <PrefsProvider>
          <SiteProvider content={content}>{children}</SiteProvider>
        </PrefsProvider>
      </body>
    </html>
  );
}
