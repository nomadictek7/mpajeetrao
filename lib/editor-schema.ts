// Describes the admin form for each editable section of the website.
// A field with key "" refers to the value itself (used for array sections and
// for lists of plain bilingual paragraphs).

import type { SectionKey } from "./site";

type Base = { key: string; label: string; help?: string };

export type Field =
  | (Base & { kind: "text" | "url" | "email" | "image" })
  | (Base & { kind: "bi" | "biArea" })
  | (Base & {
      kind: "list";
      item: Field[];
      itemName: string;
      summary: (item: never) => string;
      newItem: () => unknown;
    });

export type SectionDef = {
  key: SectionKey;
  title: string;
  description: string;
  anchor: string; // where it appears on the site
  fields: Field[];
};

const bi = () => ({ en: "", mr: "" });

export const sections: SectionDef[] = [
  {
    key: "profile",
    title: "Profile & Contact",
    description: "Name, title, portrait photo, contact details and social media links.",
    anchor: "/#home",
    fields: [
      { key: "name", label: "Full name", kind: "bi" },
      { key: "shortName", label: "Short name (header)", kind: "bi" },
      { key: "role", label: "Title / role", kind: "bi" },
      { key: "party", label: "Party", kind: "bi" },
      { key: "portrait", label: "Portrait photo (hero)", kind: "image", help: "Tall photo works best (4:5)." },
      {
        key: "logo",
        label: "Header logo",
        kind: "image",
        help: "Defaults to the official BJP lotus. Upload a square image to replace it.",
      },
      { key: "email", label: "Office email", kind: "email" },
      { key: "phone", label: "Office phone", kind: "text" },
      { key: "address", label: "Delhi address (present)", kind: "bi" },
      { key: "permanentAddress", label: "Permanent address (Nanded)", kind: "bi" },
      { key: "facebook", label: "Facebook link", kind: "url" },
      { key: "x", label: "X (Twitter) link", kind: "url" },
      { key: "instagram", label: "Instagram link", kind: "url" },
      { key: "youtube", label: "YouTube link", kind: "url" },
    ],
  },
  {
    key: "hero",
    title: "Hero highlights",
    description: "The rotating highlight messages at the top of the homepage.",
    anchor: "/#home",
    fields: [
      {
        key: "",
        label: "Highlights",
        kind: "list",
        itemName: "highlight",
        summary: (x: { title: { en: string } }) => x.title.en,
        newItem: () => ({ title: bi(), text: bi() }),
        item: [
          { key: "title", label: "Heading", kind: "bi" },
          { key: "text", label: "Text", kind: "biArea" },
        ],
      },
    ],
  },
  {
    key: "about",
    title: "About",
    description: "Biography paragraphs and the fact cards beside them.",
    anchor: "/about",
    fields: [
      { key: "heading", label: "Section heading", kind: "bi" },
      {
        key: "body",
        label: "Biography paragraphs",
        kind: "list",
        itemName: "paragraph",
        summary: (x: { en: string }) => x.en,
        newItem: bi,
        item: [{ key: "", label: "Paragraph", kind: "biArea" }],
      },
      {
        key: "stats",
        label: "Fact cards",
        kind: "list",
        itemName: "fact card",
        summary: (x: { value: string; label: { en: string } }) => `${x.value} — ${x.label.en}`,
        newItem: () => ({ value: "", valueMr: "", label: bi() }),
        item: [
          { key: "value", label: "Big value (English)", kind: "text" },
          { key: "valueMr", label: "Big value (Marathi, optional)", kind: "text" },
          { key: "label", label: "Caption", kind: "bi" },
        ],
      },
    ],
  },
  {
    key: "impact",
    title: "Impact",
    description: "Areas of work shown as tabs, each with text and an optional photo.",
    anchor: "/impact",
    fields: [
      {
        key: "",
        label: "Impact areas",
        kind: "list",
        itemName: "area",
        summary: (x: { title: { en: string } }) => x.title.en,
        newItem: () => ({ title: bi(), text: bi(), image: "" }),
        item: [
          { key: "title", label: "Title", kind: "bi" },
          { key: "text", label: "Description", kind: "biArea" },
          { key: "image", label: "Photo", kind: "image" },
        ],
      },
    ],
  },
  {
    key: "journey",
    title: "Journey",
    description: "Timeline of milestones, from the top down.",
    anchor: "/journey",
    fields: [
      {
        key: "",
        label: "Milestones",
        kind: "list",
        itemName: "milestone",
        summary: (x: { year: string; title: { en: string } }) => `${x.year} — ${x.title.en}`,
        newItem: () => ({ year: "", title: bi(), text: bi() }),
        item: [
          { key: "year", label: "Year / label", kind: "text" },
          { key: "title", label: "Title", kind: "bi" },
          { key: "text", label: "Details (shown on Read more)", kind: "biArea" },
        ],
      },
    ],
  },
  {
    key: "press",
    title: "Press",
    description: "News coverage cards linking to articles.",
    anchor: "/press",
    fields: [
      {
        key: "",
        label: "Press items",
        kind: "list",
        itemName: "press item",
        summary: (x: { title: { en: string }; date: string }) => `${x.title.en}${x.date ? ` (${x.date})` : ""}`,
        newItem: () => ({ title: bi(), date: "", href: "", image: "" }),
        item: [
          { key: "title", label: "Headline", kind: "bi" },
          { key: "date", label: "Date", kind: "text", help: "Any format, e.g. 12 Oct 2026" },
          { key: "href", label: "Article link", kind: "url" },
          { key: "image", label: "Thumbnail (optional)", kind: "image" },
        ],
      },
    ],
  },
  {
    key: "events",
    title: "Events",
    description: "Recent and upcoming programmes, with an optional photo for each.",
    anchor: "/#events",
    fields: [
      {
        key: "",
        label: "Events",
        kind: "list",
        itemName: "event",
        summary: (x: { date: string; title: { en: string } }) => `${x.date} — ${x.title.en}`,
        newItem: () => ({ date: "", title: bi(), place: bi(), image: "", href: "" }),
        item: [
          { key: "date", label: "Date", kind: "text", help: "Short, e.g. 24 Nov" },
          { key: "title", label: "Event", kind: "bi" },
          { key: "place", label: "Place", kind: "bi" },
          { key: "image", label: "Photo", kind: "image", help: "Optional. Landscape photos work best." },
          {
            key: "href",
            label: "Link",
            kind: "url",
            help: "Optional. News article, video or post opened when the event is clicked — e.g. https://… or /blog/my-post",
          },
        ],
      },
    ],
  },
  {
    key: "donate",
    title: "Footer links",
    description: "The “Contribute” links in the footer.",
    anchor: "/#follow",
    fields: [
      {
        key: "",
        label: "Links",
        kind: "list",
        itemName: "link",
        summary: (x: { label: string }) => x.label,
        newItem: () => ({ label: "", href: "" }),
        item: [
          { key: "label", label: "Label", kind: "text" },
          { key: "href", label: "Link", kind: "url" },
        ],
      },
    ],
  },
  {
    key: "labels",
    title: "Headings & labels",
    description: "Section headings, intro lines and footer titles across the website. Clear a field to go back to the original wording.",
    anchor: "/",
    fields: [
      { key: "listen", label: "Hero bar: first button", kind: "bi", help: "Links to the contact form." },
      { key: "act", label: "Hero bar: second button", kind: "bi", help: "Links to Impact." },
      { key: "share", label: "Hero bar: share button", kind: "bi" },
      { key: "impact", label: "Impact heading", kind: "bi" },
      { key: "parliament", label: "Parliament heading", kind: "bi" },
      { key: "parliamentSub", label: "Parliament intro", kind: "biArea" },
      { key: "journey", label: "Journey heading", kind: "bi" },
      { key: "latestPress", label: "Press heading", kind: "bi" },
      { key: "gallery", label: "Gallery heading", kind: "bi" },
      { key: "fromBlog", label: "Blog heading (homepage)", kind: "bi" },
      { key: "events", label: "Events heading", kind: "bi" },
      { key: "contact", label: "Contact heading", kind: "bi" },
      { key: "contactSub", label: "Contact intro", kind: "biArea" },
      { key: "newsletter", label: "Footer: newsletter line", kind: "bi" },
      { key: "quickLinks", label: "Footer: quick links title", kind: "bi" },
      { key: "donate", label: "Footer: contribute title", kind: "bi" },
      { key: "follow", label: "Footer: follow title", kind: "bi" },
      { key: "questionsTitle", label: "Questions page heading", kind: "bi" },
      { key: "questionsIntro", label: "Questions page intro", kind: "biArea" },
    ],
  },
];

export const sectionByKey = (key: string) => sections.find((s) => s.key === key);
