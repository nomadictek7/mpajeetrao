// Search engine helpers: the canonical site URL and schema.org structured data.

import type { SiteContent } from "./site";

// Set SITE_URL once a custom domain is connected; until then the Vercel production URL is canonical.
export const siteUrl = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${siteUrl}${path}`);

// Spellings people search for: Wikipedia uses "Ajit", the MP's own pages "Ajeet".
export const nameVariants = [
  "Dr. Ajeet Madhavrao Gopchade",
  "Ajeet Gopchade",
  "Ajit Gopchade",
  "Dr. Ajit Gopchade",
  "Ajit Madhavrao Gopchade",
];

export const keywords = [
  ...nameVariants,
  "डॉ. अजित गोपछडे",
  "अजित गोपछडे",
  "Gopchade MP",
  "Rajya Sabha MP Maharashtra",
  "Nanded MP",
  "Marathwada",
  "BJP Maharashtra",
  "BJP Doctors Cell",
];

const wikipedia = "https://en.wikipedia.org/wiki/Ajit_Gopchade";
const wikidata = "https://www.wikidata.org/wiki/Q124705622";

export const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

export function personJsonLd({ profile }: Pick<SiteContent, "profile">) {
  return {
    "@type": "Person",
    "@id": personId,
    name: profile.name.en,
    alternateName: [...nameVariants.filter((n) => n !== profile.name.en), profile.name.mr, profile.shortName.mr],
    honorificPrefix: "Dr.",
    givenName: "Ajeet",
    familyName: "Gopchade",
    jobTitle: profile.role.en,
    description:
      "Member of Parliament in the Rajya Sabha from Maharashtra, paediatrician from Nanded, and former Vice-President of BJP Maharashtra.",
    birthDate: "1970-11-19",
    birthPlace: { "@type": "Place", name: "Nanded, Maharashtra, India" },
    nationality: { "@type": "Country", name: "India" },
    image: abs(profile.portrait || "/opengraph-image.jpg"),
    url: siteUrl,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: profile.phone || undefined,
    memberOf: [
      { "@type": "PoliticalParty", name: profile.party.en, url: "https://www.bjp.org/" },
      { "@type": "GovernmentOrganization", name: "Rajya Sabha", url: "https://sansad.in/rs" },
    ],
    hasOccupation: [
      { "@type": "Occupation", name: "Member of Parliament, Rajya Sabha" },
      { "@type": "Occupation", name: "Paediatrician" },
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Swami Ramanand Teerth Rural Medical College" },
      { "@type": "CollegeOrUniversity", name: "Government Medical College, Aurangabad" },
    ],
    homeLocation: { "@type": "Place", name: "Nanded, Maharashtra" },
    sameAs: [profile.facebook, profile.x, profile.instagram, profile.youtube, wikipedia, wikidata].filter(Boolean),
  };
}

export function homeJsonLd(content: Pick<SiteContent, "profile">) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: content.profile.name.en,
        alternateName: nameVariants.slice(1),
        inLanguage: ["en-IN", "mr-IN"],
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${content.profile.name.en} – Official Website`,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      personJsonLd(content),
    ],
  };
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

// Escapes "<" so stored text can never close the <script> tag.
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
