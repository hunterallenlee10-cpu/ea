// Shape of the typed content files in /content/{pages,services,cities,posts}/*.json,
// generated from the live site by scripts/build-content.ts.

export type Inline = { text: string; html: string };

export type Node =
  | { t: "h2" | "h3" | "h4"; text: string }
  | { t: "p"; text: string; html: string }
  | { t: "list"; items: Inline[] }
  | { t: "cta"; label: string; href: string }
  | { t: "photo"; id: string }
  | { t: "faqs"; items: { q: string; a: Inline[] }[] }
  | { t: "testimonials"; items: { name: string; text: string }[] }
  | { t: "steps"; items: { title: string; body: Inline[] }[] };

export type Kind = "core" | "service" | "city" | "post" | "other";

export type PageContent = {
  path: string;
  kind: Kind;
  slug: string;
  /** Live <title>, word for word (or a new one only where the live one was missing). */
  title: string;
  /** Live meta description, word for word (or new where missing). */
  description: string;
  descriptionIsNew?: boolean;
  og: { title: string; description: string; type: string; image: string; imageIsReplacement: boolean };
  twitter: { card: string; title: string; description: string };
  h1: string;
  nodes: Node[];
  post?: { published: string; publishedDisplay: string };
  /** From the live sitemap. */
  lastmod: string | null;
  fixes: string[];
};
